pragma solidity >=0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
    struct Star {
        string name;
    }

    string public constant name = "FooBar";
    string public constant symbol = "FBT";

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell a Star you don't own");
        starsForSale[_tokenId] = _price;
    }


    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        require(msg.value > starCost, "You need to have enough Ether");

        address ownerAddress = ownerOf(_tokenId);
        _transferFrom(ownerAddress, msg.sender, _tokenId);

        address payable ownerAddressPayable = _make_payable(ownerAddress);
        ownerAddressPayable.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        address ownerAddress1 = ownerOf(_tokenId1);
        address ownerAddress2 = ownerOf(_tokenId2);
        require(ownerAddress1 == msg.sender || ownerAddress2 == msg.sender, "To exchange start you must be the owner of either one of them");

        _transferFrom(ownerAddress1, ownerAddress2, _tokenId1);
        _transferFrom(ownerAddress2, ownerAddress1, _tokenId2);
    }

    function transferStar(address _to1, uint256 _tokenId) public {
        address ownerAddress = ownerOf(_tokenId);
        require(ownerAddress == msg.sender, "To transfer a star you must be its owner");

        _transferFrom(msg.sender, _to1, _tokenId);
    }

}
