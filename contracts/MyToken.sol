// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev Token cryptocurrency custom dengan fitur burnable dan pausable
 */
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor untuk menginisialisasi token
     * @param initialSupply Jumlah supply awal
     */
    constructor(
        uint256 initialSupply
    ) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        emit TokensMinted(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Pause semua transfer token
     * Hanya owner yang bisa memanggil
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause semua transfer token
     * Hanya owner yang bisa memanggil
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Mint token baru
     * @param to Alamat tujuan
     * @param amount Jumlah token
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn token dari alamat tertentu
     * @param account Alamat pemilik token
     * @param amount Jumlah token yang akan dibakar
     */
    function burnFrom(address account, uint256 amount)
        public
        override
        onlyOwner
    {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    // Internal functions untuk override

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, amount);
    }

    function nonces(address owner)
        public
        view
        override(ERC20)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
