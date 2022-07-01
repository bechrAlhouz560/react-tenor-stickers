import React from 'react'
import { storiesOf } from '@storybook/react'

import Sticker from '../lib/components/Sticker.jsx'
import StickerAPI from '../lib/helpers/sticker-api.js'

const stories = storiesOf('Stickers Test', module)

stories.add('Sticker', () => {

    function handleChange(date) {
        console.log(date)
    }


    StickerAPI.key = "W2S5ULJU86FB"


    return (
    <div style={{ 
        width: '100%', height: '100vh', backgroundColor: '#white', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
        <Sticker onStickerClick={function () {}}></Sticker>
    </div>
    )
})