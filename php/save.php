#!/usr/bin/php-cgi
<?php
    session_start();
    $_POST = json_decode(file_get_contents('php://input'), true);

    $_SESSION['uuid'] = $_POST['uuid'];
    $_SESSION['lives'] = $_POST['lives'];
    $_SESSION['points'] = $_POST['points'];
    $_SESSION['invincible'] = $_POST['invincible'];
    $_SESSION['scenestatus'] = $_POST['scenestatus'];
    $_SESSION['totaltime'] = $_POST['totaltime'];


    $encodeScene = json_encode($_SESSION['scenestatus']);
    $encodeEnemy = json_encode($_SESSION['scenestatus']);

    $conn = oci_connect('**********', '*********', 'ORCLCDB');
    $insert="INSERT INTO space_save
    (uuid, lives, points, scenestatus, invincible, totaltime )
    VALUES
    (:uuid, :lives, :points, :scenestatus , :invincible, :totaltime)";
    $comanda = oci_parse($conn, $insert);
    oci_bind_by_name($comanda,":uuid", $_SESSION['uuid']);
    oci_bind_by_name($comanda,":lives", $_SESSION['lives']);
    oci_bind_by_name($comanda,":points", $_SESSION['points']);
    oci_bind_by_name($comanda,":scenestatus", $encodeScene);
    oci_bind_by_name($comanda,":invincible", $_SESSION['invincible']);
    oci_bind_by_name($comanda,":totaltime", $_SESSION['totaltime']);
    oci_execute($comanda);
    # Pujar a la base de dades
    echo json_encode(true);
?>


