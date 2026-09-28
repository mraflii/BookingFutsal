<?php
include "connect.php";
$kode_booking = (isset($_POST['kode_booking'])) ? htmlentities($_POST['kode_booking']) : "";

if (!empty($_POST['delete_booking_validate'])) {
    $select = mysqli_query($conn, "SELECT kode_booking FROM tb_list_booking WHERE kode_booking = '$kode_booking'");
    if (mysqli_num_rows($select) > 0) {
        $message = '<script>alert("Order telah memiliki item booking, data booking ini tidak dapat di hapus");
        window.location="../booking"</script>';
    } else {
        $query = mysqli_query($conn, "DELETE FROM tb_booking WHERE id_booking ='$kode_booking'");
        if ($query) {
            $message = '<script>alert("Data berhasil dihapus");
                    window.location="../booking"</script>';
        } else {
            $message = '<script>alert("Data gagal dihapus");
                    window.location="../booking"</script>';
        }
    }
}
echo $message;
?>