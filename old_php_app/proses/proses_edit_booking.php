<?php
session_start();
include "connect.php";
$kode_booking = (isset($_POST['kode_booking'])) ? htmlentities($_POST['kode_booking']) : "";
$kode_lapangan = (isset($_POST['kode_lapangan'])) ? htmlentities($_POST['kode_lapangan']) : "";
$pelanggan = (isset($_POST['pelanggan'])) ? htmlentities($_POST['pelanggan']) : "";

if (!empty($_POST['edit_booking_validate'])) {
    $select = mysqli_query($conn, "SELECT * FROM tb_booking WHERE id_booking = '$kode_booking'");
    $query = mysqli_query($conn, "UPDATE tb_booking SET  kode_lapangan='$kode_lapangan', pelanggan='$pelanggan' WHERE id_booking='$kode_booking'");
    if ($query) {
        $message = '<script>alert("Data berhasil diupdate")
        window.location="../booking"</script>
        </script>';
    } else {
        $message = '<script>alert("Data gagal diupdate")
        window.location="../booking"</script>';
    }
}

echo $message;
?>