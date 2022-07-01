import axios from "axios";

const StickerAPI = {

    key : null,
    main_url : function () {
        if (this.key)
        {
            return new URL('https://g.tenor.com/v1/?key='+key)
        }
        else
        {
            throw new Error('you should define your key to use the api, using Sticker.key');
        }
    },
    getCategories : async function   (signal) {
        let url = new URL(this.main_url())
        url.pathname += 'categories/';

        let response = await axios.get(url.href,{
            signal
        });
        return response.data.tags;
    },

    getCategoryGIF : async function (category,next,signal) {
        let url = new URL(category.path);
        if (next)
        {
            url.searchParams.append('pos',next) ;

        }
        let response = await axios.get(url.href,{
            signal
        });
        
        return response.data;
    },
    searchGIF : async function (query,next,signal) {
        let url = new URL(this.main_url())
        url.pathname += 'search/';
        url.searchParams.append('q',query);
        if (next)
        {
            url.searchParams.append('pos',next) ;

        }
        let response = await axios.get(url,{
            signal
        });
        return response.data;
    }
} 


export default StickerAPI;