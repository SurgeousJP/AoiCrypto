//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./pool/IAoiPoolActions.sol";
import "./pool/IAoiPoolDerivedState.sol";
import "./pool/IAoiPoolEvents.sol";
import "./pool/IAoiPoolImmutables.sol";
import "./pool/IAoiPoolOwnerActions.sol";
import "./pool/IAoiPoolState.sol";

interface IAoiPool is
    IAoiPoolActions,
    IAoiPoolDerivedState,
    IAoiPoolEvents,
    IAoiPoolImmutables,
    IAoiPoolOwnerActions,
    IAoiPoolState
{}
