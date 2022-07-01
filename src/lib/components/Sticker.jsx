import React , { useState,useEffect } from "react";
import { TextLoading } from "./LoadingBars.jsx";
import styles from './sticker.module.css'

import Masonry from "react-responsive-masonry";
import StickerAPI  from "../helpers/sticker-api";
import timesIcon from '../../assets/times.svg'

import arrowLeft from '../../assets/arrow-left.svg';

export const GIFContainer = React.memo(function GIFContainer ({onClick,playState,style,setPlayState,gif,setLoading,loading}) {
    return <div className={styles["gif"]} style={style} onDoubleClick={onClick} onClick={
        function () {
            setPlayState('url')
        }
    }>
        {/* <Image src={gif.media[0].gif.url} width={200} height={200}/> */}
        {loading ? <TextLoading width={"100px"} height={"100px"} styles={
            {
                margin: "10px"
            }
        } /> : ""}
    
        <img src={gif.media[0].nanogif[playState]} loading="eager" 
        onMouseEnter = {
            function () {
                setPlayState('url')
            }
        }
        onMouseLeave = {
            function () {
                setPlayState('preview')
            }
        }
        
        onLoad={
        function (e) {
            
            setLoading(false)
        }
    }  alt="" style={
            {
                display: loading ? "none" : ""
            }
        }/>
        
    </div>
},function (prevProps,nextProps) {
    return prevProps.gif.media[0].nanogif[prevProps.playState] === nextProps.gif.media[0].nanogif[nextProps.playState]
           && prevProps.loading === nextProps.loading
}) 

export function GIF (props) {
    let {style,onClick,gif} = props;
    let [loading, setLoading] = useState(true);
    let [playState,setPlayState] = useState('preview')
    return <GIFContainer style={style} 
    onClick={onClick} 
    loading={loading} 
    setLoading={setLoading} 
    setPlayState={setPlayState} 
    gif={gif}
    playState={playState}
    />
} 



export const StickerList = React.memo (function StickerList ({gifList,onStickerClick}) {
    return <div className={styles["gif-list"]}>
    <div className={styles["list"]}>
        <Masonry columnsCount={3}>
            {
                gifList.map(function (gif, index) {
                    return <GIF key={index} onClick={
                            function () {
                                onStickerClick(gif)
                            }



                        } gif={gif} />
                })
            }
        </Masonry>
        
    </div>
    
        </div>
},function (left,right) {
    return left.gifList.length === right.gifList.length;
}) 
export default function Sticker({["styles"] : _styles,onStickerClick}) {
    let [categories,setCategories] = useState([]);
    let [ActiveCategory,setActiveCategory] = useState({});
    let [gifList,setGifList] = useState([]);
    let [nextList,setNextList] = useState(null);
    let [controller,setController] = useState(new AbortController());
    let [activeSearch,setActiveSearch] = useState(false);
    let [query,setQuery] = useState('');
    let [searchResult, setSrchResult] = useState([]);
    let [loading,setLoading] = useState(false);
    async function fetchStickers() {
        if (!loading || nextList !== "0")
        {
            setLoading(true);
            let gif;
            if (!activeSearch)
            {
                gif = await StickerAPI.getCategoryGIF(ActiveCategory,nextList,);
            }
            else
            {
                gif = await StickerAPI.searchGIF(query,nextList);
            }
            setGifList([...gifList,...gif.results]);
            setNextList(gif.next);
            setLoading(false);
        }
    }
    useEffect( () => {
        (async function () {
            let _cat = await StickerAPI.getCategories(controller.signal);
            setCategories(_cat);
        })()
        return function () {
            
            setController(new AbortController())
        }
    }, []);

    return <div className={styles["stickers"]} 
    style={
        {..._styles, overflowY: ActiveCategory.name || activeSearch ? "auto" : ""}
    }
    onScroll={
        async function (e) {

            let target = e.currentTarget;
            let client = target.clientHeight;
            let height = target.scrollHeight;
            let max = height - client;

            if (target.scrollTop >= max - 20)
            {
                await fetchStickers();
                target.scroll(0,max - 200);
            }
        }
    }
    >
        <div className={styles["sticker-srch"]}>
            {
                ActiveCategory.name ? <div className={styles["btn-icon"]} onClick={
                    function () {
                        setNextList(null)
                        setActiveCategory({})
                        setGifList([])
                        controller.abort()
                        setController(new AbortController());
                        
                    }
                }>
                    <img src={arrowLeft} alt="" />
                </div> : ""
            }
            <input type="text" className={styles["v-input"]}
                placeholder="Search sticker" 
                value={query} onKeyDown={
                async function (e) {
                    if (e.key === "Enter")
                    {
                        setGifList([])
                        setActiveSearch(true);
                        let result = await StickerAPI.searchGIF(query,"40");
                        setGifList(result.results);
                        setNextList(result.next)
                    }
                }
            
            } onChange={
                function (e) {
                    let value = e.currentTarget.value;
                    setQuery(value);

                }
            }/>
            <div className={styles["btn-icon"]} onClick={
                function () {
                    setActiveSearch(false);
                    setQuery('')
                    setSrchResult([])
                    setNextList(null);
                }
            }>
                <img src={timesIcon} alt="" />
            </div>
        </div>

        {(function () {
            if (!activeSearch)
            {
                return !ActiveCategory.name ? <div className={styles["categories"]}>
            {
                categories.map(function (cat,index) {
                    return <div className={styles["category"]} key={index} onClick={
                        async function () {
                            setActiveCategory(cat);
                            let gif = await StickerAPI.getCategoryGIF(cat,null,controller.signal);
                            setNextList(gif.next);
                            setGifList(gif.results);
                        }
                    }>
                        <img src={cat.image} alt="" />
                        <span>{cat.name}</span>
                    </div>
                })
            }
                </div> : <StickerList gifList={gifList} onStickerClick={onStickerClick}/>} 
            }
              
        )()}
        {activeSearch ? 
            <div className={styles["gif-list"]}>
            <div className={styles["list"]}>
                <Masonry columnsCount={3}>
                    {
                        gifList.map(function (gif,index) {
                            return <GIF key={index} onClick={
                                    function () {
                                        onStickerClick(gif)
                                    }
                                

                                
                                } gif={gif} />
                        })
                    }
                </Masonry>
            </div>
        </div> : ""
        }
        
    </div>
}
