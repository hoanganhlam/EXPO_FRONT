<template>
    <div>
        <header class="header">
            <nav class="navbar is-primary">
                <div class="container">
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
                        <div class="navbar-end">
                            <a class="navbar-item">About</a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main class="main">
            <nuxt></nuxt>
        </main>
        <footer class="footer">
            <div class="container">
                <p><strong>Made</strong> with ❤️</p>
            </div>
        </footer>
    </div>
</template>
