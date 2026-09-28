<?php
include "connect.php";
$id_lapangan = (isset($_POST['id_lapangan'])) ? htmlentities($_POST['id_lapangan']) : "";
$nama_lapangan = (isset($_POST['nama_lapangan']) ? htmlentities($_POST['nama_lapangan']) : "");
$harga = (isset($_POST['harga']) ? htmlentities($_POST['harga']) : "");

$kode_rand = rand(10000, 99999) . "-";
$target_dir = "../assets/img/" . $kode_rand;
$target_file = $target_dir . basename($_FILES['foto']['name']);
$imageType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

if (!empty($_POST['edit_dlapangan_validate'])) {
    // Cek apakah gambar atau bukan
    $cek = getimagesize($_FILES['foto']['tmp_name']);
    if ($cek === false) {
        $message = "Ini bukan file gambar";
        $statusUpload = 0;
    } else {
        $statusUpload = 1;
        if (file_exists($target_file)) {
            $message = "Maaf, file yang dimasukkan telah ada";
            $statusUpload = 0;
        } else {
            if ($_FILES['foto']['size'] > 500000) { // 500kb
                $message = "File foto yang diupload terlalu besar";
                $statusUpload = 0;
            } else {
                if ($imageType != "jpg" && $imageType != "png" && $imageType != "jpeg" && $imageType != "gif") {
                    $message = "Maaf, hanya diperbolehkan gambar yang memiliki format JPG, JPEG, PNG dan GIF";
                    $statusUpload = 0;
                }
            }
        }
    }

    if ($statusUpload == 0) {
        $message = '<script>alert("' . $message . ', gambar tidak dapat diupload");
        window.location="../lapangan";</script>';
    } else {
        $select = mysqli_query($conn, "SELECT * FROM tb_daftar_lapangan WHERE nama_lapangan = '$nama_lapangan'");
        if (mysqli_num_rows($select) > 0) {
            $message = '<script>alert("Nama lapangan yang dimasukkan telah ada");
            window.location="../lapangan";</script>';
        } else {
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $target_file)) {
                $query = mysqli_query($conn, "UPDATE tb_daftar_lapangan SET foto='" . $kode_rand . $_FILES['foto']['name'] . "', nama_lapangan='$nama_lapangan', harga='$harga' WHERE id_lapangan='$id_lapangan'");
                if ($query) {
                    $message = '<script>alert("Data berhasil dimasukkan");
                        window.location="../lapangan";</script>';
                } else {
                    $message = '<script>alert("Data gagal dimasukkan");
                         window.location="../lapangan";</script>';
                }
            } else {
                $message = '<script>alert("Maaf, terjadi kesalahan. File tidak dapat diupload");
                window.location="../lapangan";</script>';
            }
        }
    }
}
echo $message;
?>