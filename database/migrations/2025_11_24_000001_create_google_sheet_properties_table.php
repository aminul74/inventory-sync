<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('google_sheet_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('google_sheet_id')->constrained()->onDelete('cascade');
            $table->json('properties');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('google_sheet_properties');
    }
};
