<?php
include "connect.php";
$id_lapangan = (isset($_POST['id_lapangan'])) ? htmlentities($_POST['id_lapangan']) : "";
$foto = (isset($_POST['foto'])) ? htmlentities($_POST['foto']) : "";

if (!empty($_POST['delete_lapangan_validate'])) {
    $query = mysqli_query($conn, "DELETE FROM tb_daftar_lapangan WHERE id_lapangan='$id_lapangan'");
    if ($query) {
        unlink("../assets/img/$foto");
        $message = '<script>alert("Data berhasil dihapus");
                    window.location="../lapangan"</script> 
                    </script>';
    } else {
        $message = '<script>alert("Data gagal dihapus");
                  window.location="../lapangan"</script> 
                    </script>';
    }
}
echo $message;
?>