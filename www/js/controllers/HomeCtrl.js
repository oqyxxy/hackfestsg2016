app.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user, $ionicModal, $location, $merchants, $QRScanner) {

    if (!$user.isLoggedIn()) {
        $state.go('signin');
    }

    $scope.user = $user;

    $ionicModal.fromTemplateUrl('templates/receipt.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.receipt = modal;
    });
    $scope.openReceipt = function () {
        $scope.receipt.show();
    };
    $scope.closeReceipt = function () {
        $scope.receipt.hide();
    };
    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function () {
        $scope.receipt.remove();
    });

    $scope.getIdByQr = function () {
        $merchants.latestMerchant = null;

        $QRScanner.scanBarcode()
         .then(function (barcodeData) {
             $scope.verifyCode(barcodeData.text);
         }).catch(function (error) {
             $ionicPopup.alert({
                 title: "Scanning failed",
                 subTitle: error
             });
         });
    };

    $scope.getIdByText = function () {
        $merchants.latestMerchant = null;
        $scope.verifyCode(1); // sample
        //TODO: invoke state/modal for input
        //TODO: Call verifyCode(code) after getting text
    };

    $scope.verifyCode = function (code) {
        $merchants.searchWithCode(code)
        .then(function (merchant) {
            $state.go('payment');
        }).catch(function (error) {
            $ionicPopup.alert({
                title: "Merchant search failed",
                subTitle: error
            });
        });
    };

    $scope.makeQR = function () {
        // Code, container, size
        $QRScanner.makeQRCode("1234567", "testing123", 200);
    };
});