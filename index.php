<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $text = $_POST['code'] ?? '';
    $id = bin2hex(random_bytes(6));
    if (!is_dir('data')) mkdir('data');
    file_put_contents("data/{$id}.txt", $text);
    $link = "https://yourdomain.com/raw.php?id=$id";
}
?>
<!DOCTYPE html>
<html lang="pt-BR" class="h-full">
<head>
  <meta charset="UTF-8">
  <title>Gerador de Link RAW</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white h-full flex items-center justify-center">
  <div class="max-w-xl w-full p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6">
    <h1 class="text-2xl font-bold text-center">📎 Gerar Link RAW</h1>
    <form method="POST">
      <textarea name="code" class="w-full h-40 p-4 rounded bg-gray-700 text-white resize-none" placeholder="Cole seu código aqui..." required></textarea>
      <button type="submit" class="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        Gerar Link
      </button>
    </form>
    <?php if (!empty($link)): ?>
      <div class="bg-gray-700 p-4 rounded text-center">
        <p>🌐 Link RAW:</p>
        <a href="<?= $link ?>" class="text-blue-400 underline break-words"><?= $link ?></a>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
