<div class="col-lg-3 ">
    <nav class="navbar navbar-expand-lg bg-light rounded border mt-2">
        <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel" style="width:230px">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasNavbarLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav nav-pills flex-column justify-content-end flex-grow-1">
                        <li class="nav-item">
                            <a class="nav-link ps-2 <?php echo ((isset($_GET['x']) && $_GET['x'] == 'dashboard') || !isset($_GET['x'])) ? 'active link-light bg-success ' : 'link-dark'; ?>"
                                aria-current="page" href="dashboard"><i class="bi bi-house-door"></i>
                                Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ps-2  <?php echo (isset($_GET['x']) && $_GET['x'] == 'jadwal') ? 'active link-light bg-success' : 'link-dark'; ?>"
                                href="jadwal"><i class="bi bi-calendar3"></i>
                                Jadwal</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ps-2 <?php echo (isset($_GET['x']) && $_GET['x'] == 'lapangan') ? 'active link-light bg-success' : 'link-dark'; ?>"
                                href="lapangan"><i
                                    class="bi bi-hypnotize"></i><!-- <img src="assets/img/lapangan.png" width="50px" height="25px"> -->
                                Lapangan</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ps-2  <?php echo (isset($_GET['x']) && $_GET['x'] == 'booking') ? 'active link-light bg-success' : 'link-dark'; ?>"
                                href="booking"><i class="bi bi-cash"></i>
                                Booking</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ps-2 <?php echo (isset($_GET['x']) && $_GET['x'] == 'report') ? 'active link-light bg-success' : 'link-dark'; ?>"
                                href="report"><i class="bi bi-clipboard2-data"></i>
                                Report</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ps-2 <?php echo (isset($_GET['x']) && $_GET['x'] == 'user') ? 'active link-light bg-success' : 'link-dark'; ?>"
                                href="user"><i class="bi bi-person"></i>
                                User</a>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    </nav>
</div>