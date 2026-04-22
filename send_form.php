<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // ---------- 1. ПОЛУЧАЕМ ДАННЫЕ ИЗ ФОРМЫ ----------
    $user_name = htmlspecialchars(trim($_POST['name']));
    $user_phone = htmlspecialchars(trim($_POST['phone']));
    $user_comment = htmlspecialchars(trim($_POST['comments']));

    // ---------- 2. НАСТРОЙКИ ДЛЯ ОТПРАВКИ EMAIL ----------
    $to = "info@natyazhmir.ru"; // Ваш email
    $subject = "Новая заявка с сайта НатяжМир";
    $message = "Имя: $user_name\nТелефон: $user_phone\nКомментарий: $user_comment";
    $headers = "From: no-reply@natyazhmir.ru";

    // Отправляем email
    $mail_sent = mail($to, $subject, $message, $headers);

    // ---------- 3. НАСТРОЙКИ ДЛЯ PUSHOVER (ЗВУК НА ТЕЛЕФОНЕ) ----------
    // СЮДА ВСТАВЬТЕ ВАШИ ДАННЫЕ ИЗ АККАУНТА PUSHOVER!
    $pushover_user_key = "ВАШ_USER_KEY";
    $pushover_api_token = "ВАШ_API_TOKEN";

    // Формируем текст для уведомления
    $pushover_message = "Новая заявка от $user_name ($user_phone)";
    $pushover_title = "НатяжМир - Заявка";

    // Данные для POST-запроса к API Pushover
    $post_data = [
        'token' => $pushover_api_token,
        'user' => $pushover_user_key,
        'message' => $pushover_message,
        'title' => $pushover_title,
        'sound' => 'pushover' // Звук по умолчанию, можно выбрать любой из списка в приложении
    ];

    // Отправляем запрос к API Pushover
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.pushover.net/1/messages.json');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $pushover_response = curl_exec($ch);
    $pushover_success = curl_getinfo($ch, CURLINFO_HTTP_CODE) == 200;
    curl_close($ch);

    // ---------- 4. ОТВЕТ ПОЛЬЗОВАТЕЛЮ ----------
    if ($mail_sent && $pushover_success) {
        // Если и письмо, и уведомление отправлены успешно
        $response = ["status" => "success", "message" => "Спасибо, ваша заявка принята!"];
    } else {
        // Если что-то пошло не так
        $response = ["status" => "error", "message" => "Произошла ошибка. Попробуйте позже."];
    }

    // Отправляем JSON-ответ обратно на сайт
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
