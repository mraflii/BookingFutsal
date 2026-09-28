<?php
session_start();
include "connect.php";
$kode_booking = (isset($_POST['kode_booking'])) ? htmlentities($_POST['kode_booking']) : "";
$kode_lapangan = (isset($_POST['kode_lapangan'])) ? htmlentities($_POST['kode_lapangan']) : "";
$pelanggan = (isset($_POST['pelanggan'])) ? htmlentities($_POST['pelanggan']) : "";

if (!empty($_POST['input_booking_validate'])) {
    $select = mysqli_query($conn, "SELECT * FROM tb_booking WHERE id_booking = '$kode_booking'");
    if (mysqli_num_rows($select) > 0) {
        $message = '<script>alert("booking yang dimasukan telah ada")
        window.location="../booking"</script>';
    } else {
        $query = mysqli_query($conn, "INSERT INTO tb_booking (id_booking,kode_lapangan,pelanggan)values('$kode_booking','$kode_lapangan','$pelanggan')");
        if ($query) {
            $message = '<script>alert("Data berhasil dimasukkan")
            window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $kode_lapangan . '&pelanggan=' . $pelanggan . '"</script>';
        } else {
            $message = '<script>alert("Data gagal dimasukkan")</script>';
        }
    }

}
echo $message;
?>