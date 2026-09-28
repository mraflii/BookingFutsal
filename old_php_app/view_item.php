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
}
$select_lapangan = mysqli_query($conn, "SELECT id_lapangan,nama_lapangan FROM tb_daftar_lapangan");
?>
<div class="col-lg-9 mt-2">
    <div class="card">
        <div class="card-header">
            Halaman View Item
        </div>
        <div class="card-body">
            <a href="report" class="btn btn-success mb-3">
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

            <?php

            if (empty($result)) {
                echo "Data user tidak ada";
            } else {
                foreach ($result as $row) {
                    ?>
                    <?php
                }

                ?>
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
                                    <td class="d-flex">
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

        </div>
    </div>
</div>