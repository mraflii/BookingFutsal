<?php
session_start();
if (empty($_SESSION['username_alouhfutsal'])) {
    header('location:login');
}
include "proses/connect.php";
$query = mysqli_query($conn, "SELECT *FROM tb_user WHERE username = '$_SESSION[username_alouhfutsal]'");
$hasil = mysqli_fetch_array($query);
?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sistem Booking Futsal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    <link href="assets/css/tabel.css" rel="stylesheet" />
    <link href="assets/css/sidebar.css" rel="stylesheet" />
</head>

<body style="height:3000px">
    <!-- Header -->
    <?php include "header.php" ?>
    <!-- end Header -->
    <div class="container-fluid ">
        <div class="row mb-5">
            <!-- Sidebar -->
            <?php include "sidebar.php" ?>
            <!-- End Sidebar -->

            <!-- Content -->
            <?php
            include $page;
            ?>
            <!-- End Content -->
        </div>
        <div class="fixed-bottom text-center bg-light py-2">
            Project Akhir Base learning Muhammad Rafli -Sistem Booking Fustal
        </div>
    </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
    <script>
        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (() => {
            'use strict'

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.needs-validation')

            // Loop over them and prevent submission
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }

                    form.classList.add('was-validated')
                }, false)
            })
        })()
    </script>
</body>

</html>