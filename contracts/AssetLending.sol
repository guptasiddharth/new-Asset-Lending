pragma solidity ^0.4.0;
contract AssetLending{
    event assetAdded(address owner,uint assetId,uint rent);
    event ownershipTransfered(uint assetId,address by,address to);

    address owner;
    
    function AssetLending(){                
        owner=msg.sender;
    }
    
    struct asset{                                          //details of asset added to structure
        address primaryOwner;
        address secondaryOwner;
        uint assetID;
        uint deposit;
        uint rent;
    }
    
    mapping (uint=>asset) public assets;                   //mapping is done of assetid with structure 
    mapping (address=>uint) balance;
      mapping (string=>address) userAddress;
    
    
    function storeAddress(string username,address addr){
        userAddress[username]=addr;
    }
    
    function fetchAddress(string username) returns (address){
        return userAddress[username];
    }
    
    modifier isOwner(){                                    //checks ownership of assetadder is contract owner
        require(msg.sender==owner);
        _;
    }
    
    modifier uniqueId(uint assetId){                       //checks if the assetid is unique or not
        for(uint i=0;i<assetCounter.length;i++){
            require(assetCounter[i]!=assetId);
        }
        _;
    }
    
    uint[] assetCounter;                                   //maintaining registry of asset Id
    
    function addAsset(uint assetId,address owner,uint deposit,uint rent) isOwner uniqueId(assetId){
        assets[assetId].primaryOwner=owner;
        assets[assetId].secondaryOwner=owner;
        assets[assetId].assetID=assetId;
        assets[assetId].deposit=deposit;
        assets[assetId].rent=rent;

        // assetCounter.length+=1;
        // assetCounter[assetCounter.length-1]=assetId;
        assetCounter.push(assetId);
        
        assetAdded(msg.sender,assetId,rent);                  //Trigger event
    }
    
    function fetchAssetDetails(uint assetId) returns (address ,address,uint,uint){                 
        return (assets[assetId].primaryOwner,assets[assetId].secondaryOwner,assets[assetId].deposit,assets[assetId].rent);
    }
    
    modifier onlyOwner(uint assetId){
        require(assets[assetId].primaryOwner==msg.sender);  //primaryOwner changes secondary ownership
        _;
    }
    
    function transferAssetOwnership(address buyer,uint assetId) isOwner {                //onlyOwner(assetId)
        assets[assetId].secondaryOwner=buyer;
        ownershipTransfered(assetId,msg.sender,buyer);
        buyerPaysOwner(buyer,assets[assetId].deposit);      //for making payment transfering to new function
    }
    
    function buyerPaysOwner(address buyer,uint deposit){
        if(balance[buyer]>deposit){
            balance[buyer]-=deposit;                         //sending from buyer to owner(msg.sender)
            balance[msg.sender]+=deposit;
        }
    }
}