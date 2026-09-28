<?php
include "connect.php";
$id = (isset($_POST['id'])) ? htmlentities($_POST['id']) : "";
$kode_booking = (isset($_POST['kode_booking'])) ? htmlentities($_POST['kode_booking']) : "";
$kodelapangan = (isset($_POST['kode_lapangan'])) ? htmlentities($_POST['kode_lapangan']) : "";
$pelanggan = (isset($_POST['pelanggan'])) ? htmlentities($_POST['pelanggan']) : "";

if (!empty($_POST['delete_bookingitem_validate'])) {
    mysqli_query($conn, "DELETE FROM tb_jadwal WHERE  id='$kode_booking';");
    $query = mysqli_query($conn, "DELETE FROM tb_list_booking WHERE id_list_booking ='$id'");
    if ($query) {
        $message = '<script>alert("Data berhasil dihapus");
        window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $kodelapangan . '&pelanggan=' . $pelanggan . '"</script>';

    } else {
        $message = '<script>alert("Data gagal dihapus");
        window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $kodelapangan . '&pelanggan=' . $pelanggan . '"</script>';

    }
}
echo $message;
?>