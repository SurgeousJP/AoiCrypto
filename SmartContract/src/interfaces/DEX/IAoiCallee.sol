pragma solidity ^0.8.0;

interface IAoiCallee {
    function aoiCallee(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external;
}
