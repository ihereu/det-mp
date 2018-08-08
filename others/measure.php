<?php
    print_r($_REQUEST);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
<script>

function test(){
    wx.miniProgram.navigateTo({
  url: '../measure/userAuth'
})
}

function setMeasureResult(){
  wx.miniProgram.relaunch({
    url: './webview?collar=66'
  })
}

    </script>

</head>
<body>

    <p>
    <a href="javascript:test()">Body Measure</a>
    </p>

    <p>
    <a href="javascript:wx.miniProgram.navigateBack();">Back</a>
    </p>

    <p><a href="javascript:wx.</p>
</body>
</html>