<?php
include "proses/connect.php";
$query = mysqli_query($conn, "SELECT * FROM tb_daftar_lapangan");
while ($record = mysqli_fetch_array($query)) {
  $result[] = $record;
}
?>

<link href="assets/css/tabel.css" rel="stylesheet" />
<div class="col-lg-9 mt-2">
  <div class="card">
    <div class="card-header">
      Halaman Lapangan
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col d-flex justify-content-end">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ModalTambahLapangan"> Tambah
            Lapangan</button>
        </div>
      </div>
      <!-- Modal Tambah Lapangan baru -->
      <div class="modal fade" id="ModalTambahLapangan" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-md-down">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Tambah Lapangan</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="needs-validation" novalidate action="proses/proses_input_dlapangan.php" method="POST"
                enctype="multipart/form-data">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="input-group mb-3">
                      <input type="file" class="form-control py-3" id="uploadFoto" placeholder="Your Name" name="foto"
                        required>
                      <label class="input-group-text" for="uploadFoto">Upload Foto Lapangan</label>
                      <div class="invalid-feedback">
                        Masukkan file foto Lapangan
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="floatingInput" placeholder="Nama Lapangan"
                        name="nama_lapangan" required>
                      <label for="floatingInput">Nama Lapangan</label>
                      <div class="invalid-feedback">
                        Masukkan nama Lapangan.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-floating mb-3">
                      <input type="number" class="form-control" id="floatingInput" placeholder="Harga" name="harga"
                        required>
                      <label for="floatingInput">Harga</label>
                      <div class="invalid-feedback">
                        Masukkan Harga
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary" name="input_lapangan_validate" value="12345">Save
                    changes</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
      <!-- Akhir modal tambah Lapangan baru -->
      <?php
      if (empty($result)) {
        echo "Data Lapangan tidak ada";
      } else {
        foreach ($result as $row) {
          ?>
          <!-- Modal View -->
          <div class="modal fade" id="ModalView<?php echo $row['id_lapangan'] ?>" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-fullscreen-md-down">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">View Lapangan</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form class="needs-validation" novalidate action="proses/proses_input_lapangan.php" method="POST"
                    enctype="multipart/form-data">
                    <div class="row">

                      <div class="col-lg-4">
                        <div class="form-floating mb-3">
                          <input disabled type="text" class="form-control" id="floatingInput"
                            value="<?php echo $row['nama_lapangan'] ?>">
                          <label for="floatingInput">Nama Lapangan</label>
                          <div class="invalid-feedback">
                            Masukkan Nama Lapangan.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-4">
                        <div class="form-floating mb-3">
                          <input disabled type="number" class="form-control" id="floatingInput"
                            value="<?php echo $row['harga'] ?>">
                          <label for="floatingInput">Harga</label>
                          <div class="invalid-feedback">
                            Masukkan Harga
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <!-- <button type="submit" class="btn btn-primary" name="input_menu_validate" value="12345">Save
                        changes</button> -->
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
          <!-- end modal view -->

          <!-- Modal edit -->
          <div class="modal fade" id="ModalEdit<?php echo $row['id_lapangan'] ?>" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-fullscreen-md-down">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Lapangan</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form class="needs-validation" novalidate action="proses/proses_edit_dlapangan.php" method="POST"
                    enctype="multipart/form-data">
                    <input type="hidden" value="<?php echo $row['id_lapangan'] ?>" name="id">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="input-group mb-3">
                          <input type="file" class="form-control py-3" id="uploadFoto" placeholder="Your Name" name="foto"
                            required>
                          <label class="input-group-text" for="uploadFoto">Upload Foto Lapangan</label>
                          <div class="invalid-feedback">
                            Masukkan file foto Lapangan
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-floating mb-3">
                          <input type="text" class="form-control" id="floatingInput" placeholder="Nama Lapangan"
                            name="nama_lapangan" required value="<?php echo $row['nama_lapangan'] ?>">
                          <label for="floatingInput">Nama Lapangan</label>
                          <div class="invalid-feedback">
                            Masukkan nama Lapangan.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-4">
                        <div class="form-floating mb-3">
                          <input type="number" class="form-control" id="floatingInput" placeholder="Harga" name="harga"
                            required value="<?php echo $row['harga'] ?>">
                          <label for="floatingInput">Harga</label>
                          <div class="invalid-feedback">
                            Masukkan Harga
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-primary" name="edit_dlapangan_validate" value="12345">Save
                        changes</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>

          <!-- end modal edit -->


          <!-- Modal delete -->
          <div class="modal fade" id="ModalDelete<?php echo $row['id_lapangan'] ?>" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md modal-fullscreen-md-down">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Lapangan</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form class="needs-validation" novalidate action="proses/proses_delete_dlapangan.php" method="POST">
                    <input type="hidden" value="<?php echo $row['id_lapangan'] ?>" name="id_lapangan" name="id_lapangan">
                    <input type="hidden" value="<?php echo $row['foto'] ?>" name="foto" name="foto">
                    <div class="col-lg-12">
                      Apakah anda ingin menghapus Lapangan <b>
                        <?php echo $row['nama_lapangan'] ?>
                      </b>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-danger" name="delete_lapangan_validate"
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
              <tr class="text-nowrap">
                <th scope="col">No</th>
                <th scope="col">Foto Lapangan</th>
                <th scope="col">Nama Lapangan</th>
                <th scope="col">Harga Sewa</th>
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
                    <div style="width: 90px">
                      <img src="assets/img/<?php echo $row['foto'] ?>" class="img-thumbnail" alt="...">
                    </div>
                  </td>
                  <td>
                    <?php echo $row['nama_lapangan'] ?>
                  </td>
                  <td>
                    <?php echo $row['harga'] ?>
                  </td>
                  <td>
                    <div class="d-flex">
                      <button class="btn btn-info btn-sm me-1" data-bs-toggle="modal"
                        data-bs-target="#ModalView<?php echo $row['id_lapangan'] ?>"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-warning btn-sm me-1" data-bs-toggle="modal"
                        data-bs-target="#ModalEdit<?php echo $row['id_lapangan'] ?>"><i
                          class="bi bi-pencil-square"></i></button>
                      <button class="btn btn-danger btn-sm me-1" data-bs-toggle="modal"
                        data-bs-target="#ModalDelete<?php echo $row['id_lapangan'] ?>"><i class="bi bi-trash"></i></button>
                    </div>
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