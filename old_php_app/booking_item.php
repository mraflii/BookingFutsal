<?php
include "proses/connect.php";
$query = mysqli_query($conn, "SELECT  *,SUM(harga*durasi) AS harganya, tb_daftar_lapangan.id_lapangan FROM tb_list_booking
LEFT JOIN tb_booking ON tb_booking.id_booking=tb_list_booking.kode_booking
LEFT JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
GROUP BY id_list_booking
HAVING tb_list_booking.kode_booking = $_GET[booking]");


$kode = $_GET['booking'];
$kodelapangan = $_GET['kode_lapangan'];
$pelanggan = $_GET['pelanggan'];
while ($record = mysqli_fetch_array($query)) {
    $result[] = $record;
    // $kode = $record['kode_booking'];
    // $kodelapangan = $record['kode_lapangan'];
    // $pelanggan = $record['pelanggan'];
}

$select_lapangan = mysqli_query($conn, "SELECT id_lapangan,nama_lapangan FROM tb_daftar_lapangan");
?>
<div class="col-lg-9 mt-2">
    <div class="card">
        <div class="card-header">
            Halaman Booking item
        </div>
        <div class="card-body">
            <a href="booking" class="btn btn-success mb-3">
                <i class="bi bi-arrow-left"></i> </a>
            <div class="row">
                <div class="col-lg-3">
                    <div class="form-floating mb-3">
                        <input disabled type="text" class="form-control" id="kodebooking" value="<?php echo $kode ?>">
                        <label for=" floatingIinput">kode Booking</label>
                        <div class="invalid-feedback">
                            Masukkan kode Booking.
                        </div>
                    </div>
                </div>
                <div class="col-lg-2">
                    <div class="form-floating mb-3">
                        <input disabled type="text" class="form-control" id="idlapangan"
                            value="<?php echo $kodelapangan ?>">
                        <label for=" floatingInput">kode Lapangan</label>
                        <div class="invalid-feedback">
                            Masukkan kode Lapangan.
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="form-floating mb-3">
                        <input disabled type="text" class="form-control" id="pelanggan"
                            value="<?php echo $pelanggan ?>">
                        <label for=" floatingInput">pelanggan</label>
                        <div class="invalid-feedback">
                            Masukkan pelanggan.
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal Tambah item baru -->
            <div class="modal fade" id="TambahItem" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-xl modal-fullscreen-md-down">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Tambah Item</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="needs-validation" novalidate action="proses/proses_input_bookingitem.php"
                                method="POST">
                                <input type="hidden" name="id" value="<?php echo $row['id_list_booking'] ?>">
                                <input type="hidden" name="kode_booking" value="<?php echo $kode ?>">
                                <input type="hidden" name="lapangan" value="<?php echo $kodelapangan ?>">
                                <input type="hidden" name="pelanggan" value="<?php echo $pelanggan ?>">
                                <div class="row">
                                    <div class="col-lg-4">
                                        <div class="form-floating mb-3">
                                            <input type="date" class="form-control" id="floatingInput"
                                                placeholder="tanggal main" name="tanggal_main" required>
                                            <label for="floatingInput"> tanggal Main</label>
                                            <div class="invalid-feedback">
                                                Masukkan Hari main.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="form-floating mb-3">
                                            <select class="form-select" name="jam_main" id="">
                                                <option value="08:00">08:00</option>
                                                <option value="09:00">09:00</option>
                                                <option value="10:00">10:00</option>
                                                <option value="11:00">11:00</option>
                                                <option value="12:00">12:00</option>
                                                <option value="13:00">13:00</option>
                                                <option value="14:00">14:00</option>
                                                <option value="15:00">15:00</option>
                                                <option value="16:00">16:00</option>
                                                <option value="17:00">17:00</option>
                                                <option value="20:00">20:00</option>
                                                <option value="21:00">21:00</option>
                                                <option value="22:00">22:00</option>
                                                <option value="23:00">23:00</option>
                                                <option value="00:00">00:00</option>
                                                <option value="01:00">01:00</option>

                                            </select>
                                            <div class="invalid-feedback">
                                                Pilih Jam main.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="form-floating mb-3">
                                            <input type="number" class="form-control" id="floatingInput"
                                                placeholder="Durasi" name="durasi" required>
                                            <label for="floatingInput"> Durasi</label>
                                            <div class="invalid-feedback">
                                                Masukkan Durasi.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" name="input_bookingitem_validate"
                                value="12345">Tambah Item</button>
                        </div>
                        </form>
                    </div>

                </div>
            </div>

            <!-- Akhir modal tambah item baru -->

            <?php

            if (empty($result)) {
                echo "Data item tidak ada";
            } else {
                foreach ($result as $row) {
                    ?>
                    <!-- Modal edit -->
                    <div class="modal fade" id="ModalEdit<?php echo $row['id_list_booking'] ?>" tabindex="-1"
                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl modal-fullscreen-md-down">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Item</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form class="needs-validation" novalidate action="proses/proses_edit_bookingitem.php"
                                        method="POST">
                                        <input type="hidden" name="id" value="<?php echo $row['id_list_booking'] ?>">
                                        <input type="hidden" name="kode_booking" value="<?php echo $kode ?>">
                                        <input type="hidden" name="lapangan" value="<?php echo $kodelapangan ?>">
                                        <input type="hidden" name="pelanggan" value="<?php echo $pelanggan ?>">
                                        <div class="row">
                                            <div class="col-lg-4">
                                                <div class="form-floating mb-3">
                                                    <input type="date" class="form-control" id="floatingInput"
                                                        placeholder="tanggal main" name="tanggal_main" required
                                                        value="<?php echo $row['tanggal_main'] ?>">
                                                    <label for="floatingInput"> tanggal Main</label>
                                                    <div class="invalid-feedback">
                                                        Masukkan Hari main.
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="form-floating mb-3">
                                                    <select class="form-select" name="jam_main" id="floatingInput" required
                                                        value="<?php echo $row['jam_main'] ?>">
                                                        <option value="08:00">08:00</option>
                                                        <option value="09:00">09:00</option>
                                                        <option value="10:00">10:00</option>
                                                        <option value="11:00">11:00</option>
                                                        <option value="12:00">12:00</option>
                                                        <option value="13:00">13:00</option>
                                                        <option value="14:00">14:00</option>
                                                        <option value="15:00">15:00</option>
                                                        <option value="16:00">16:00</option>
                                                        <option value="17:00">17:00</option>
                                                        <option value="20:00">20:00</option>
                                                        <option value="21:00">21:00</option>
                                                        <option value="22:00">22:00</option>
                                                        <option value="23:00">23:00</option>
                                                        <option value="00:00">00:00</option>
                                                        <option value="01:00">01:00</option>
                                                    </select>
                                                    <div class="invalid-feedback">
                                                        Pilih Jam main.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-4">
                                                <div class="form-floating mb-3">
                                                    <input type="number" class="form-control" id="floatingInput"
                                                        placeholder="Durasi" name="durasi" required
                                                        value="<?php echo $row['durasi'] ?>">
                                                    <label for="floatingInput"> Durasi</label>
                                                    <div class="invalid-feedback">
                                                        Masukkan Durasi.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary" name="edit_bookingitem_validate"
                                        value="12345">Save
                                        changes</button>
                                </div>
                                </form>
                            </div>

                        </div>
                    </div>

                    <!-- end modal edit -->
                    <!-- Modal delete -->
                    <div class="modal fade" id="ModalDelete<?php echo $row['id_list_booking'] ?>" tabindex="-1"
                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-md modal-fullscreen-md-down">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Booking</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form class="needs-validation" novalidate action="proses/proses_delete_bookingitem.php"
                                        method="POST">
                                        <input type="hidden" value="<?php echo $row['id_list_booking'] ?>" name="id">
                                        <input type="hidden" name="kode_booking" value="<?php echo $kode ?>">
                                        <input type="hidden" name="kode_lapangan" value=" <?php echo $kodelapangan ?>">
                                        <input type="hidden" name="pelanggan" value=" <?php echo $pelanggan ?>">
                                        <div class="col-lg-12">
                                            Apakah anda ingin menghapus Booking Item atas nama <b>
                                                <?php echo $row['pelanggan'] ?>
                                            </b> dengan kode Booking <b>
                                                <?php echo $row['kode_booking'] ?>
                                            </b>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Close</button>
                                            <button type="submit" class="btn btn-danger" name="delete_bookingitem_validate"
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
                <!-- Modal Bayar -->
                <div class="modal fade" id="Bayar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl modal-fullscreen-md-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Pembayaran</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr class="text-nowrap">
                                                <th scope="col">Nama</th>
                                                <th scope="col">nama Lapangan</th>
                                                <th scope="col">Tanggal main</th>
                                                <th scope="col">Jam main</th>
                                                <th scope="col">Durasi</th>
                                                <th scope="col">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $total = 0;
                                            foreach ($result as $row) {

                                                ?>
                                                <tr>

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
                                                        <?php echo $row['jam_main'] ?>
                                                    </td>
                                                    <td>
                                                        <?php echo $row['durasi'], ' jam' ?>
                                                    </td>
                                                    <td>
                                                        <?php echo number_format($row['harganya'], 2, '.', '.') ?>
                                                    </td>
                                                </tr>
                                                <?php
                                                $total += $row['harganya'];
                                            }
                                            ?>
                                            <tr>
                                                <td colspan="5" class="fw-bold">
                                                    Total Harga
                                                </td>
                                                <td class="fw-bold">
                                                    <?php echo number_format($total, 2, ',', ',') ?>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <span class="text-danger fs-5 fw-semibold">Apakah Anda Yakin Ingin Melakukan
                                    Pembayaran?</span>
                                <form class="needs-validation" novalidate action="proses/proses_bayar.php" method="POST">
                                    <input type="hidden" name="id" value="<?php echo $row['id_list_booking'] ?>">
                                    <input type="hidden" name="kode_booking" value="<?php echo $kode ?>">
                                    <input type="hidden" name="kodelapangan" value="<?php echo $kode_lapangan ?>">
                                    <input type="hidden" name="pelanggan" value="<?php echo $pelanggan ?>">
                                    <input type="hidden" name="total" value="<?php echo $total ?>">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="form-floating mb-3">
                                                <input type="number" class="form-control" id="floatingInput"
                                                    placeholder="Nominal Uang" name="uang" required>
                                                <label for="floatingInput">Nominal Uang</label>
                                                <div class="invalid-feedback">
                                                    Masukkan jumlah nominal uang.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" name="bayar_validate"
                                    value="12345">Bayar</button>
                            </div>
                            </form>
                        </div>

                    </div>
                </div>

                <!-- Akhir modal Bayar -->
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr class="text-nowap">
                                <th scope="col">Nama</th>
                                <th scope="col">nama Lapangan</th>
                                <th scope="col">Tanggal main</th>
                                <th scope="col">Jam main</th>
                                <th scope="col">Durasi</th>
                                <th scope="col">Total</th>
                                <th scope="col">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $total = 0;
                            foreach ($result as $row) {

                                ?>
                                <tr>
                                    <td>
                                        <?php echo $row['pelanggan'] ?>
                                    </td>
                                    <td>
                                        <!-- <?php echo ($row['kode_lapangan'] == 1) ? "Fiber" : "Rumput"; ?> -->
                                        <?php echo $row['nama_lapangan'] ?>
                                    </td>
                                    <td>
                                        <?php echo $row['tanggal_main'] ?>
                                    </td>
                                    <td>
                                        <?php echo $row['jam_main'] ?>
                                    </td>
                                    <td>
                                        <?php echo $row['durasi'], ' jam' ?>
                                    </td>
                                    <td>
                                        <?php echo number_format($row['harganya'], 2, '.', '.') ?>
                                    </td>
                                    <td class="d-flex">
                                        <button
                                            class="<?php echo (!empty($row['id_bayar'])) ? "btn btn-secondary btn-sm me-1 disabled" : "btn btn-warning btn-sm me-1"; ?>"
                                            data-bs-toggle="modal"
                                            data-bs-target="#ModalEdit<?php echo $row['id_list_booking'] ?>"><i
                                                class="bi bi-pencil-square"></i></button>
                                        <button
                                            class="<?php echo (!empty($row['id_bayar'])) ? "btn btn-secondary btn-sm me-1 disabled" : "btn btn-danger btn-sm me-1"; ?>"
                                            data-bs-toggle="modal"
                                            data-bs-target="#ModalDelete<?php echo $row['id_list_booking'] ?>"><i
                                                class="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                                <?php
                                $total += $row['harganya'];
                            }
                            ?>
                            <tr>
                                <td colspan="5" class="fw-bold">
                                    Total Harga
                                </td>
                                <td class="fw-bold">
                                    <?php echo number_format($total, 2, ',', ',') ?>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <?php
            }
            ?>
            <div>
                <button
                    class="<?php echo (!empty($row['id_bayar'])) ? "btn btn-secondary disabled" : "btn btn-success"; ?>"
                    data-bs-toggle="modal" data-bs-target="#TambahItem"><i class="bi bi-plus-circle"></i>
                    Item</button>
                <button
                    class="<?php echo (!empty($row['id_bayar'])) ? "btn btn-secondary disabled" : "btn btn-primary"; ?>"
                    data-bs-toggle="modal" data-bs-target="#Bayar"><i class="bi bi-cash-coin"></i>
                    Bayar</button>


            </div>

        </div>
    </div>
</div>