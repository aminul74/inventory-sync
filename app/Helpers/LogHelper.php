<?php

use Illuminate\Support\Facades\Log;

class LogHelper
{
    public static function logExceptionWithContext($e): void
    {
        $message = $e->getMessage();
        $context = method_exists($e, 'getContext') ? $e->getContext() : [];
        Log::error($message, $context);
    }
}
