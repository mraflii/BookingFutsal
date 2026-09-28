<?php
include "proses/connect.php";
$query = mysqli_query($conn, "SELECT tb_booking .* ,tb_bayar.*,tb_daftar_lapangan.*,nama FROM tb_booking
LEFT JOIN tb_user ON tb_user.id = tb_booking.pelanggan
LEFT JOIN tb_list_booking ON tb_list_booking.kode_booking = tb_booking.id_booking
LEFT JOIN tb_daftar_lapangan ON tb_daftar_lapangan.id_lapangan = tb_booking.kode_lapangan
LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
GROUP BY id_booking ORDER BY waktu_booking ASC");
while ($record = mysqli_fetch_array($query)) {
  $result[] = $record;
}
?>
<div class="col-lg-9 mt-2">
  <div class="card">
    <div class="card-header">
      Halaman Report
    </div>
    <div class="card-body">

      <?php

      if (empty($result)) {
        echo "Data Report tidak ada";
      } else {
        foreach ($result as $row) {
          ?>
          <?php
        }
        ?>

        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Kode booking</th>
                <th scope="col">pelanggan</th>
                <th scope="col">Nama lapangan</th>
                <th scope="col">waktu booking</th>
                <th scope="col">waktu Bayar</th>
                <th scope="col">Total Bayar</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <?php
              $no = 1;
              foreach ($result as $row) {

                ?>
                <tr>
                  <th scope="row">
                    <?php echo $no++ ?>
                  </th>
                  <td>
                    <?php echo $row['id_booking'] ?>
                  </td>
                  <td>
                    <?php echo $row['pelanggan'] ?>
                  </td>
                  <td>
                    <?php echo $row['nama_lapangan'] ?>
                  </td>
                  <td>
                    <?php echo $row['waktu_booking'] ?>
                  </td>
                  <td>
                    <?php echo $row['waktu_bayar'] ?>
                  </td>

                  <td>
                    <?php echo $row['total_bayar'] ?>
                  </td>
                  <td class="d-flex">
                    <a class="btn btn-info btn-sm me-1"
                      href="./?x=viewitem&booking=<?php echo $row['id_booking'] . "&pelanggan=" . $row['pelanggan'] . "&kode_lapangan=" . $row['kode_lapangan'] ?>"><i
                        class="bi bi-eye"></i></a>
                  </td>
                </tr>
                <?php
              }
              ?>
            </tbody>
          </table>
        </div>
        <?php
      }
      ?>

    </div>
  </div>
</div>
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