<template>
    <div>
        <header class="header">
            <nav class="navbar">
                <div class="navbar-brand">
                    <n-link to="/" class="navbar-item">
                        <img src="/logo.png" alt="Logo">
                    </n-link>
                    <span class="navbar-burger burger" data-target="navbarMenuHeroB">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </div>
                <div id="navbarMenuHeroB" class="navbar-menu">
                    <div class="navbar-start">
                        <div class="navbar-item">
                            <div class="field has-addons">
                                <div class="control">
                                    <span class="button">
                                        <x-icon name="search"></x-icon>
                                    </span>
                                </div>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Find a repository">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <span class="button is-static">About</span>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main class="main">
            <nuxt></nuxt>
        </main>
    </div>
</template>
