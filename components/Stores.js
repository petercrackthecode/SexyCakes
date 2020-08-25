import React, {Fragment} from 'react';
import {View, Text} from 'react-native';

import NearbyStores from './NearbyStores';
import FavoriteStores from './FavoriteStores';

export default function Stores({navigation, zipCode, hits, hasMore, refineNext }) {
    return (
        <Fragment>
            <FavoriteStores navigation={navigation} zipCode={zipCode}/>
            <NearbyStores navigation={navigation} zipCode={zipCode} hits={hits} hasMore={hasMore} refineNext={refineNext}/>
        </Fragment>
    );
}