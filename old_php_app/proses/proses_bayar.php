<?php
session_start();
include "connect.php";
$kode_booking = (isset($_POST['kode_booking'])) ? htmlentities($_POST['kode_booking']) : "";
$kodelapangan = (isset($_POST['kode_lapangan'])) ? htmlentities($_POST['kode_lapangan']) : "";
$pelanggan = (isset($_POST['pelanggan'])) ? htmlentities($_POST['pelanggan']) : "";
$total = (isset($_POST['total'])) ? htmlentities($_POST['total']) : "";
$uang = (isset($_POST['uang'])) ? htmlentities($_POST['uang']) : "";
$kembalian = $uang - $total;


if (!empty($_POST['bayar_validate'])) {
    if ($kembalian < 0) {
        $message = '<script>alert("NOMINAL UANG TIDAK MENCUKUPI")
        window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $kodelapangan . '&pelanggan=' . $pelanggan . '"</script>';
    } else {
        $query = mysqli_query($conn, "INSERT INTO tb_bayar (id_bayar,nominal_uang,total_bayar)values('$kode_booking','$uang','$total')");
        if ($query) {
            $message = '<script>alert("Pembayaran Berhasil \n UANG KEMBALIAN Rp.' . $kembalian . '")
                window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $kodelapangan . '&pelanggan=' . $pelanggan . '"</script>';
        } else {
            $message = '<script>alert("Pembayaran Gagal");
                window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $kodelapangan . '&pelanggan=' . $pelanggan . '"</script>';
        }
    }
}
echo $message;
?>