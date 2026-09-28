<?php
include "proses/connect.php";
$query = mysqli_query($conn, "SELECT * FROM tb_jadwal
JOIN tb_booking ON tb_jadwal.id = tb_booking.id_booking
JOIN tb_list_booking ON tb_list_booking.kode_booking = tb_booking.id_booking
JOIN tb_daftar_lapangan ON tb_daftar_lapangan.id_lapangan = tb_booking.kode_lapangan
ORDER BY tb_list_booking.tanggal_main ASC");
while ($record = mysqli_fetch_array($query)) {
  $result[] = $record;
}
?>
<link href="assets/css/tabel.css" rel="stylesheet" />
<div class="col-lg-9 mt-2">
  <div class="card">
    <div class="card-header">
      Jadwal
    </div>
    <div class="card-body">
      <?php

      if (empty($result)) {
        echo "Data jadwal tidak ada";
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
                <th scope="col">Nama</th>
                <th scope="col">Nama Lapangan</th>
                <th scope="col">Jadwal Main</th>
                <th scope="col">Waktu Booking</th>
                <th scope="col">Jam</th>
                <th scope="col">Durasi Main</th>

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
                    <?php echo $row['pelanggan'] ?>
                  </td>
                  <td>
                    <?php echo $row['nama_lapangan'] ?>
                  </td>
                  <td>
                    <?php echo $row['tanggal_main'] ?>
                  </td>
                  <td>
                    <?php echo $row['waktu_booking'] ?>
                  </td>
                  <td>
                    <?php echo $row['jam_main'] ?>
                  </td>
                  <td>
                    <?php echo $row['durasi'], ' jam' ?>
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

    </body>

    </html>

  </div>
</div>