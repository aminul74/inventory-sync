<?php

namespace App\Exceptions;

use Exception;

class ShopifyApiException extends Exception
{
    public array $context;

    public function __construct(string $message, array $context = [])
    {
        parent::__construct($message);
        $this->context = $context;
    }

    public function getContext(): array
    {
        return $this->context;
    }
}
