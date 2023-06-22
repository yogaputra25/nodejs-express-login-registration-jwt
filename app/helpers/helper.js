// File: helpers.js

// Fungsi untuk mengirim respons sukses dengan data
const sendSuccessResponse = (res, data) => {
    res.status(200).json({
      success: true,
      message: "Data Success Updated",
      data: data
    });
  };
  
  // Fungsi untuk mengirim respons gagal dengan pesan kesalahan
  const sendErrorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  
  // Middleware untuk menangani kesalahan server
  const handleServerError = (err, req, res, next) => {
    console.error(err.stack);
    sendErrorResponse(res, 'Terjadi kesalahan server', 500);
  };
  
  // Middleware untuk menangani rute tidak ditemukan
  const handleNotFound = (req, res, next) => {
    sendErrorResponse(res, 'Rute tidak ditemukan', 404);
  };
  
  module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
    handleServerError,
    handleNotFound
  };