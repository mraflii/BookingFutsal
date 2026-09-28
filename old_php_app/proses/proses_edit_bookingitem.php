<?php
session_start();
include "connect.php";
$id = (isset($_POST['id'])) ? htmlentities($_POST['id']) : "";
$kode_booking = (isset($_POST['kode_booking'])) ? htmlentities($_POST['kode_booking']) : "";
$pelanggan = (isset($_POST['pelanggan'])) ? htmlentities($_POST['pelanggan']) : "";
$lapangan = (isset($_POST['lapangan'])) ? htmlentities($_POST['lapangan']) : '0';
$tanggalmain = (!empty($_POST['tanggal_main'])) ? htmlentities($_POST['tanggal_main']) : "";
$jam = (!empty($_POST['jam_main'])) ? htmlentities($_POST['jam_main']) : 0;
$durasi = (!empty($_POST['durasi'])) ? htmlentities($_POST['durasi']) : 0;


// echo $tanggalmain;
// exit();
if (!empty($_POST['edit_bookingitem_validate'])) {
    $select = mysqli_query($conn, "SELECT * FROM tb_list_booking WHERE   kode_booking='$kode_booking' && id_list_booking != $id");
    if (mysqli_num_rows($select) > 0) {
        $message = '<script>alert("item yang dimasukan telah ada")
        window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $lapangan . '&pelanggan=' . $pelanggan . '"</script>';
    } else {
        $query = mysqli_query($conn, "UPDATE tb_list_booking SET tanggal_main='$tanggalmain',jam_main='$jam',durasi ='$durasi' WHERE id_list_booking='$id'");
        if ($query) {
            $message = '<script>alert("Data berhasil dimasukkan")
            window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $lapangan . '&pelanggan=' . $pelanggan . '"</script>';
        } else {
            $message = '<script>alert("Data gagal dimasukkan");
            window.location="../?x=bookingitem&booking=' . $kode_booking . '&kode_lapangan=' . $lapangan . '&pelanggan=' . $pelanggan . '"</script>';
        }
    }

}
echo $message;
?>