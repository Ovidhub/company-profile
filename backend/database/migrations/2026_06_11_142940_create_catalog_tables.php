<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('label');
            $table->string('icon')->default('ShoppingBag');
            $table->string('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->text('image');
            $table->text('description');
            $table->json('features')->default('[]');
            $table->boolean('in_stock')->default(true);
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('reviews')->default(0);
            $table->string('badge')->nullable();
            $table->timestamps();
        });

        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('subtitle');
            $table->text('image');
            $table->string('tag');
            $table->string('icon_name')->default('Sparkles');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->text('text');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->timestamps();
        });

        Schema::create('site_images', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('url');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_images');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('hero_slides');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
