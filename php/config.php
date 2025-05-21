<?php
/*
 * 設定ファイル
 */

// デバッグモード（本番環境ではfalseに設定）
define('DEBUG_MODE', true);

// 送信先メールアドレス
define('ADMIN_EMAIL', 'Kageyama@legament.co.jp');

// メールの件名
define('MAIL_SUBJECT', '【レガメントHP】お問い合わせ');

// 自動返信メール件名
define('AUTO_REPLY_SUBJECT', '【株式会社レガメント】お問い合わせありがとうございます');

// 自動返信メール送信元
define('FROM_EMAIL', 'no-reply@legament.co.jp');
define('FROM_NAME', '株式会社レガメント');

// リダイレクト設定
define('REDIRECT_URL', '../contact.html?sent=success');
define('ERROR_URL', '../contact.html?error=true');

// セッションの開始
session_start();

// CSRF対策のトークン生成
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// エラーハンドリング
if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

/**
 * 文字列のサニタイズ
 * 
 * @param string $str サニタイズする文字列
 * @return string サニタイズされた文字列
 */
function sanitize($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

/**
 * メール送信処理
 * 
 * @param string $to 送信先
 * @param string $subject 件名
 * @param string $message 本文
 * @param string $from_email 送信元メールアドレス
 * @param string $from_name 送信元名
 * @param string $cc CCアドレス (オプション)
 * @return bool 送信成功か失敗か
 */
function send_mail($to, $subject, $message, $from_email, $from_name, $cc = '') {
    // 日本語対応
    mb_language("japanese");
    mb_internal_encoding("UTF-8");
    
    // ヘッダー設定
    $headers = "From: " . mb_encode_mimeheader($from_name) . " <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $from_email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if ($cc) {
        $headers .= "Cc: " . $cc . "\r\n";
    }
    
    // 送信
    return mb_send_mail($to, $subject, $message, $headers);
}
