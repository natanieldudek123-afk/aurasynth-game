<?php
$env = parse_ini_file('.env');
// api/leaderboard.php — Aura Synthesizer v3.0 Leaderboard API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('DB_HOST', $env['DB_HOST']);
define('DB_NAME', $env['DB_NAME']);
define('DB_USER', $env['DB_USER']);
define('DB_PASS', $env['DB_PASS']);
define('DB_CHARSET', 'utf8mb4');

function getPDO(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

function jsonError(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    // ── GET: return top 50 ───────────────────────────────────
    if ($method === 'GET') {
        $stmt = getPDO()->prepare("
            SELECT id, username, highest_aura_name, highest_aura_value,
                   transcendences, total_rolls, player_level, cosmic_shards, updated_at
            FROM leaderboard
            ORDER BY transcendences DESC, highest_aura_value DESC
            LIMIT 50
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll();

        // Cast numeric strings to proper types for JSON
        foreach ($rows as &$row) {
            $row['id']                 = (int)$row['id'];
            $row['highest_aura_value'] = (int)$row['highest_aura_value'];
            $row['transcendences']     = (int)$row['transcendences'];
            $row['total_rolls']        = (int)$row['total_rolls'];
            $row['player_level']       = (int)$row['player_level'];
            $row['cosmic_shards']      = (int)$row['cosmic_shards'];
        }
        unset($row);

        echo json_encode(['leaderboard' => $rows, 'total' => count($rows)]);
        exit;
    }

    // ── POST: upsert a score ─────────────────────────────────
    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);

        if (!$body) {
            jsonError('Invalid JSON body');
        }

        $username          = trim((string)($body['username']           ?? ''));
        $highest_aura_name = trim((string)($body['highest_aura_name']  ?? '—'));
        $highest_aura_value= (int)($body['highest_aura_value']         ?? 0);
        $transcendences    = (int)($body['transcendences']             ?? 0);
        $total_rolls       = (int)($body['total_rolls']                ?? 0);
        $player_level      = (int)($body['player_level']               ?? 1);
        $cosmic_shards     = (int)($body['cosmic_shards']              ?? 0);

        if (empty($username) || strlen($username) > 64) {
            jsonError('Username must be 1–64 characters');
        }

        $username          = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
        $highest_aura_name = htmlspecialchars($highest_aura_name, ENT_QUOTES, 'UTF-8');

        $sql = "
            INSERT INTO leaderboard
                (username, highest_aura_name, highest_aura_value, transcendences,
                 total_rolls, player_level, cosmic_shards)
            VALUES
                (:username, :highest_aura_name, :highest_aura_value, :transcendences,
                 :total_rolls, :player_level, :cosmic_shards)
            ON DUPLICATE KEY UPDATE
                highest_aura_name  = IF(VALUES(highest_aura_value) >= highest_aura_value, VALUES(highest_aura_name), highest_aura_name),
                highest_aura_value = GREATEST(highest_aura_value, VALUES(highest_aura_value)),
                transcendences     = GREATEST(transcendences,     VALUES(transcendences)),
                total_rolls        = GREATEST(total_rolls,        VALUES(total_rolls)),
                player_level       = GREATEST(player_level,       VALUES(player_level)),
                cosmic_shards      = GREATEST(cosmic_shards,      VALUES(cosmic_shards)),
                updated_at         = CURRENT_TIMESTAMP
        ";

        $stmt = getPDO()->prepare($sql);
        $stmt->execute([
            ':username'           => $username,
            ':highest_aura_name'  => $highest_aura_name,
            ':highest_aura_value' => $highest_aura_value,
            ':transcendences'     => $transcendences,
            ':total_rolls'        => $total_rolls,
            ':player_level'       => $player_level,
            ':cosmic_shards'      => $cosmic_shards,
        ]);

        echo json_encode(['message' => 'Score submitted successfully', 'username' => $username]);
        exit;
    }

    jsonError('Method not allowed', 405);

} catch (PDOException $e) {
    error_log('AuraSynth DB error: ' . $e->getMessage());
    jsonError('Database error — please try again later', 500);
} catch (Throwable $e) {
    error_log('AuraSynth error: ' . $e->getMessage());
    jsonError('Server error', 500);
}
