// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
 import { default as Web3} from 'web3';
 import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import Asset_artifacts from '../../build/contracts/AssetLending.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetLend= contract(Asset_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    AssetLend.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.setStatus("Account configured");
    });
  },



  addAsset: function() {
    var self = this;

    var id = parseInt(document.getElementById("id").value);
    var deposit = document.getElementById("deposit").value;
    var rent = document.getElementById("rent").value;
    var username = document.getElementById("username").value;
    var address;

    this.setStatus("Fetching address .....");

    var meta;
    AssetLend.deployed().then(function(instance) {
      meta = instance;
      return meta.fetchAddress(username, {from: account});
    }).then(function(value) {
      self.setStatus("Address received!");
      address=value.valueOf();
      self.addAsset1(id,deposit,rent,address);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error fetching address; see log.");
    });
  },


  addAsset1: function(id,deposit,rent,address) {
    var self = this;


    this.setStatus("Adding Asset .....");

    var meta;
    AssetLend.deployed().then(function(instance) {
      meta = instance;
      return meta.addAsset(id,deposit,rent,address, {from: account});
    }).then(function() {
      self.setStatus("Asset Added!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error adding asset; see log.");
    });
  },




  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },



  generateAddress: function() {
    var self = this;
    var user = document.getElementById("user1");
    var buyer = web3.eth.accounts.create();

    this.setStatus("generating address .....");

    var meta;
    AssetLend.deployed().then(function(instance) {
      meta = instance;
      return meta.storeAddress(user,buyer, {from: account});
    }).then(function(value) {
      self.setStatus("Address generated!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error finding address; see log.");
    });
  },


  buyAsset: function() {
    var self = this;
    var id = parseInt(document.getElementById("id1").value);
    var buyer = parseInt(document.getElementById("buyer").value);

    this.setStatus("Finding address .....");

    var meta;
    AssetLend.deployed().then(function(instance) {
      meta = instance;
      return meta.fetchAddress(buyer, {from: account});
    }).then(function(value) {
      self.setStatus("Address found!");
      address=value.valueOf();
      self.buyAsset1(id,address);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error finding address; see log.");
    });
  },






  buyAsset1: function(id,buyer) {
    var self = this;

    this.setStatus("Finding Asset .....");

    var meta;
    AssetLend.deployed().then(function(instance) {
      meta = instance;
      return meta.transferAssetOwnership(id,buyer, {from: account});
    }).then(function() {
      self.setStatus("Ownership transfered!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error transfering asset; see log.");
    });
  }
};
















window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});