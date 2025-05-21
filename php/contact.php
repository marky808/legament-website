<?php
/*
 * お問い合わせフォーム処理
 */

// 設定ファイルの読み込み
require_once 'config.php';

// POSTリクエストのみ受け付ける
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . ERROR_URL);
    exit;
}

// CSRF対策
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    header('Location: ' . ERROR_URL . '&reason=csrf');
    exit;
}

// 必須項目のチェック
$required_fields = ['name', 'email', 'inquiry_type', 'message', 'privacy'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = $field;
    }
}

// プライバシーポリシー同意チェック
if (!isset($_POST['privacy']) || $_POST['privacy'] !== 'on') {
    $errors[] = 'privacy';
}

// エラーがある場合はリダイレクト
if (!empty($errors)) {
    $error_query = http_build_query(['error' => true, 'fields' => implode(',', $errors)]);
    header('Location: ' . ERROR_URL . '&' . $error_query);
    exit;
}

// 入力値の取得とサニタイズ
$name = sanitize($_POST['name']);
$company = isset($_POST['company']) ? sanitize($_POST['company']) : '';
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$inquiry_type = sanitize($_POST['inquiry_type']);
$message = sanitize($_POST['message']);

// メールアドレスバリデーション
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . ERROR_URL . '&reason=invalid_email');
    exit;
}

// 電話番号バリデーション（任意）
if (!empty($phone)) {
    // ハイフンや括弧を削除して数字のみにする
    $phone_numeric = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($phone_numeric) < 10 || strlen($phone_numeric) > 11) {
        header('Location: ' . ERROR_URL . '&reason=invalid_phone');
        exit;
    }
}

// スパム対策（簡易的なハニーポット）
if (isset($_POST['website']) && !empty($_POST['website'])) {
    // ボットが隠しフィールドに値を入れた場合
    http_response_code(200); // 成功を装う
    exit;
}

// 管理者宛メール本文の作成
$admin_message = "■ お問い合わせ内容 ■\n\n";
$admin_message .= "お名前: {$name}\n";
$admin_message .= "会社名: {$company}\n";
$admin_message .= "メールアドレス: {$email}\n";
$admin_message .= "電話番号: {$phone}\n";
$admin_message .= "お問い合わせ内容: {$inquiry_type}\n";
$admin_message .= "お問い合わせ詳細:\n{$message}\n\n";
$admin_message .= "-----------------------------------\n";
$admin_message .= "送信日時: " . date('Y/m/d H:i:s') . "\n";
$admin_message .= "送信元IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// 自動返信メール本文の作成
$auto_reply_message = "{$name} 様\n\n";
$auto_reply_message .= "この度は株式会社レガメントへお問い合わせいただき、誠にありがとうございます。\n";
$auto_reply_message .= "下記の内容でお問い合わせを受け付けました。\n\n";
$auto_reply_message .= "■ お問い合わせ内容 ■\n\n";
$auto_reply_message .= "お名前: {$name}\n";
$auto_reply_message .= "会社名: {$company}\n";
$auto_reply_message .= "メールアドレス: {$email}\n";
$auto_reply_message .= "電話番号: {$phone}\n";
$auto_reply_message .= "お問い合わせ内容: {$inquiry_type}\n";
$auto_reply_message .= "お問い合わせ詳細:\n{$message}\n\n";
$auto_reply_message .= "-----------------------------------\n\n";
$auto_reply_message .= "内容を確認の上、担当者より折り返しご連絡させていただきます。\n";
$auto_reply_message .= "なお、お問い合わせの内容によっては、ご回答までにお時間をいただく場合がございます。\n";
$auto_reply_message .= "あらかじめご了承ください。\n\n";
$auto_reply_message .= "※このメールは自動送信されています。このメールに返信いただいても対応できない場合がございます。\n\n";
$auto_reply_message .= "-----------------------------------\n";
$auto_reply_message .= "株式会社レガメント\n";
$auto_reply_message .= "〒108-0074 東京都港区高輪1-20-2 NEUK白金高輪303\n";
$auto_reply_message .= "TEL：03-3761-6008\n";
$auto_reply_message .= "MAIL：Kageyama@legament.co.jp\n";
$auto_reply_message .= "-----------------------------------\n";

// CC設定（任意）
$cc = '';

// 管理者へのメール送信
$admin_mail_sent = send_mail(
    ADMIN_EMAIL,
    MAIL_SUBJECT,
    $admin_message,
    $email,
    $name,
    $cc
);

// ユーザーへの自動返信メール送信
$auto_reply_sent = send_mail(
    $email,
    AUTO_REPLY_SUBJECT,
    $auto_reply_message,
    FROM_EMAIL,
    FROM_NAME
);

// 送信結果の確認
if ($admin_mail_sent && $auto_reply_sent) {
    // 成功時：CSRFトークンを再生成
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    
    // リダイレクト
    header('Location: ' . REDIRECT_URL);
    exit;
} else {
    // 失敗時
    header('Location: ' . ERROR_URL . '&reason=mail_error');
    exit;
}
