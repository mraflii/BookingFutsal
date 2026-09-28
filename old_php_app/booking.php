<?php
include "proses/connect.php";
$query = mysqli_query($conn, "SELECT *, SUM(harga*durasi) AS harganya
FROM tb_booking
LEFT JOIN tb_list_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
LEFT JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
GROUP BY tb_booking.id_booking, tb_list_booking.id_list_booking
");
while ($record = mysqli_fetch_array($query)) {
  $result[] = $record;
}

$select_lapangan = mysqli_query($conn, "SELECT * FROM tb_daftar_lapangan");
?>

<div class="col-lg-9 mt-2">
  <div class="card">
    <div class="card-header">
      Halaman Booking
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col d-flex justify-content-end">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ModalTambahBooking"> Tambah
            Booking</button>
        </div>
      </div>
      <!-- Modal Tambah Booking baru -->
      <div class="modal fade" id="ModalTambahBooking" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-fullscreen-md-down">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Tambah Booking</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="needs-validation" novalidate action="proses/proses_input_booking.php" method="POST">
                <div class="row">
                  <div class="col-lg-5">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control " id="uploadFoto" name="kode_booking"
                        value="<?php echo date('ymdHi') . rand(100, 999) ?>" readonly>
                      <label for="uploadFoto">Kode booking</label>
                      <div class="invalid-feedback">
                        Masukkan kode Booking
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-5">
                    <div class="form-floating mb-3">
                      <select class="form-select" name="kode_lapangan" id="">
                        <option selected hidden value="">Pilih Lapangan</option>
                        <?php
                        foreach ($select_lapangan as $value) {
                          if ($row['kode_lapangan'] == $value['id_lapangan']) {
                            echo "<option selected value=$value[id_lapangan]>$value[nama_lapangan]</option>";
                          } else {
                            echo "<option value=$value[id_lapangan]>$value[nama_lapangan]</option>";
                          }
                        }
                        ?>
                      </select>
                      <label for="lapangan">Lapangan</label>
                      <div class="invalid-feedback">
                        Please choose a menu.
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-5">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="floatingInput" placeholder="Nama pelanggan"
                        name="pelanggan" required>
                      <label for="floatingInput">Pelanggan</label>
                      <div class="invalid-feedback">
                        Masukkan Nama Pelanggan.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary" name="input_booking_validate" value="12345">buat
                    Booking</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
      <!-- Akhir modal tambah Booking baru -->

      <?php

      if (empty($result)) {
        echo "Data Booking tidak ada";
      } else {
        foreach ($result as $row) {
          ?>
          <!-- Modal edit -->
          <div class="modal fade" id="ModalEdit<?php echo $row['id_booking'] ?>" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-fullscreen-md-down">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Booking</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form class="needs-validation" novalidate action="proses/proses_edit_booking.php" method="POST">
                    <div class="row">
                      <div class="col-lg-3">
                        <div class="form-floating mb-3">
                          <input readonly type="text" class="form-control " id="uploadFoto" name="kode_booking"
                            value="<?php echo $row['id_booking'] ?> ">
                          <label for="uploadFoto">Kode booking</label>
                          <div class="invalid-feedback">
                            Masukkan kode Booking
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-9">
                        <div class="form-floating mb-3">
                          <select class="form-select" name="kode_lapangan" id="">
                            <option selected hidden value="">Pilih Lapangan</option>
                            <?php
                            foreach ($select_lapangan as $value) {
                              if ($row['kode_lapangan'] == $value['id_lapangan']) {
                                echo "<option selected value=$value[id_lapangan]>$value[nama_lapangan]</option>";
                              } else {
                                echo "<option value=$value[id_lapangan]>$value[nama_lapangan]</option>";
                              }
                            }
                            ?>
                          </select>
                          <label for="lapangan">Lapangan</label>
                          <div class="invalid-feedback">
                            Tolong Pilih Lapangan.
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-7">
                        <div class="form-floating mb-3">
                          <input type="text" class="form-control" id="floatingInput" placeholder="Nama pelanggan"
                            name="pelanggan" required value="<?php echo $row['pelanggan'] ?>">
                          <label for="floatingInput">Pelanggan</label>
                          <div class="invalid-feedback">
                            Masukkan Nama Pelanggan.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12">
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-primary" name="edit_booking_validate"
                        value="12345">Simpan</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>

          <!-- end modal edit -->
          <!-- Modal delete -->
          <div class="modal fade" id="ModalDelete<?php echo $row['id_booking'] ?>" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md modal-fullscreen-md-down">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Delete booking</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form class="needs-validation" novalidate action="proses/proses_delete_booking.php" method="POST">
                    <input type="hidden" value="<?php echo $row['id_booking'] ?>" name="kode_booking">
                    <div class="col-lg-12">
                      Apakah anda ingin menghapus Booking atas nama <b>
                        <?php echo $row['pelanggan'] ?>
                      </b> dengan kode Booking <b>
                        <?php echo $row['id_booking'] ?>
                      </b>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-danger" name="delete_booking_validate"
                        value="12345">Delete</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <!-- end modal delete-->
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
                <th scope="col">Status</th>
                <th scope="col">waktu booking</th>
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
                    <?php echo (!empty($row['id_bayar'])) ? "<span class='badge text-bg-success'>dibayar</span>" : ""; ?>
                  </td>

                  <td>
                    <?php echo $row['waktu_booking'] ?>
                  </td>
                  <td>
                    <?php echo $row['harganya'] ?>
                  </td>
                  <td class="d-flex">
                    <a class="btn btn-info btn-sm me-1"
                      href="./?x=bookingitem&booking=<?php echo $row['id_booking'] . "&pelanggan=" . $row['pelanggan'] . "&kode_lapangan=" . $row['kode_lapangan'] ?>"><i
                        class="bi bi-eye"></i></a>
                    <button
                      class="<?php echo (!empty($row['id_bayar'])) ? "btn btn-secondary btn-sm me-1 disabled" : "btn btn-warning btn-sm me-1"; ?>"
                      data-bs-toggle="modal" data-bs-target="#ModalEdit<?php echo $row['id_booking'] ?>"><i
                        class="bi bi-pencil-square"></i></button>
                    <button
                      class="<?php echo (!empty($row['id_bayar'])) ? "btn btn-secondary btn-sm me-1 disabled" : "btn btn-danger btn-sm me-1"; ?>"
                      data-bs-toggle="modal" data-bs-target="#ModalDelete<?php echo $row['id_booking'] ?>"><i
                        class="bi bi-trash"></i></button>
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