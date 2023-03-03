import React, { useContext } from "react";
import CardList from "../../components/CardList/CardList";
import Sort from "../../components/Sort/Sort";
import { CardContext } from "../../context/cardContext";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import CardSkeleton from "../../components/CardSkeleton/CardSkeleton";
import { skeletonFakeArray } from "./data";

const CatalogPage = () => {
    const { cards } = useContext(CardContext);
    const skeletonArray = skeletonFakeArray.map((el) => <CardSkeleton key={el}/>);

    return (
        <>
            <ContentHeader title="Каталог"/>
            <Sort />
            {/* Чтобы во время загрузки карточек было видно скелетон пишем условие: если массив пустой будет массив скилетонов, а если нет - карточки */}
            {cards.length === 0 ? (
                <div className="cards">
                    {skeletonArray}
                </div>
            ) : (
                <CardList cards={cards} />
            )}
        </>
    );
};

export default CatalogPage;