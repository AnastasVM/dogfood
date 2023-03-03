import React from "react";
import { useContext } from "react";
import { CardContext } from "../../context/cardContext";
import Sort from "../../components/Sort/Sort";
import CardList from "../../components/CardList/CardList";
import ContentHeader from "../../components/ContentHeader/ContentHeader";

const FavouritesPage = () => {

    const { favourites } = useContext(CardContext);

    return (
        <>
            <ContentHeader title="Избранное"/>
            <Sort/>
            <CardList cards={favourites}/>
        </>
    )
};

export default FavouritesPage;