<?php
if (isset($_GET["x"]) && $_GET["x"] == "dashboard") {
  $page = "dashboard.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "jadwal") {
  $page = "jadwal.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "booking") {
  $page = "booking.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "report") {
  $page = "report.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "user") {
  $page = "user.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "lapangan") {
  $page = "lapangan.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "bookingitem") {
  $page = "booking_item.php";
  include "main.php";
} elseif (isset($_GET['x']) && $_GET['x'] == 'viewitem') {
  $page = "view_item.php";
  include "main.php";
} elseif (isset($_GET["x"]) && $_GET["x"] == "login") {
  include "login.php";
} elseif (isset($_GET['x']) && $_GET['x'] == 'logout') {
  include "proses/proseslogout.php";
} else {
  $page = "dashboard.php";
  include "main.php";
}
?>