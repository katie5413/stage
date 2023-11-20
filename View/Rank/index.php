<?php
session_start();
include "../../pdoInc.php";
?>

<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="../Common/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Dependencies/datatables/datatables.css?v=<?php echo time(); ?>" />
    <link rel="stylesheet" type="text/css" href="../Components/TimeTunnel/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/Table/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/Loading/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="index.css?v=<?php echo time(); ?>">
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-K7S8TL9');
    </script>
    <!-- End Google Tag Manager -->
    <title>舞台｜排行榜</title>
</head>

<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K7S8TL9" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div id="loaderWrapper" class="active" type="init">
        <div class="loader"></div>
        <div class="text init">
            初始化中
        </div>
    </div>
    <div class="timeTunnel">
        <img class="img" src="../../Images/bg.png" alt="" />
        <div class="cover" />
    </div>

    <div class="tab">
        <div class="sort">
            <p>僅列出使用次數大於 1，並依</p>
            <button class="sort-btn active" type="build-time">最新建立</button>
            <div class="bar"></div>
            <button class="sort-btn" type="times">人氣</button>
            <p>排序</p>
        </div>
        <div class="table__container">
            <table id="rankTable" class="stripe" style="width: 100%">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>信箱</th>
                        <th>房間名稱</th>
                        <th>使用人次</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>


    <script src="../Common/global.js?v=<?php echo time(); ?>"></script>
    <script src="../Common/util.js?v=<?php echo time(); ?>"></script>
    <script src="../Dependencies/jquery/jquery.min.js?v=<?php echo time(); ?>"></script>
    <script src="../Dependencies/datatables/datatables.min.js?v=<?php echo time(); ?>"></script>
    <script src="../Dependencies/datatables/dataTables.scrollResize.min.js"></script>
    <script src="../Components/Table/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/Loading/index.js?v=<?php echo time(); ?>"></script>
    <script src="index.js?v=<?php echo time(); ?>"></script>
</body>

</html>