<!doctype html>
<html lang="pl" data-bs-theme="auto">
<head>
    <script src="https://unpkg.com/vue@next"></script>
    <link href="./css/bootstrap.min.css" rel="stylesheet">   
    <link href="./css/login-page.css" rel="stylesheet"> 
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/> 
    <link rel="icon" type="image/x-icon" href="/img/favicon.ico">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Dariusz Marcisz">
    <title>OS4B - Admin Panel</title>
</head>
<body>
    <div id="app"></div>
    <script src="./js/bootstrap.bundle.min.js"></script>
    <script type="module">
        import LoginUi from './components/login-ui-0.0.1.js';
        
        <?php 
            if (isset($_GET['message']))
                echo "const message = '".$_GET['message']."';";
            else
                echo "const message = '';";
        ?>

        var app = Vue.createApp(LoginUi, {ErrorMessage: message});

        app.mount('#app');
    </script>
</body>
</html>