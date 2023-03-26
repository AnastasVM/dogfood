import React from "react";
import Accordion from "../../components/Accordion/Accordion";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import { faqData } from "./data";

const FAQPage = () => {
    return (
    <div>
        <ContentHeader title="Часто спрашивают"/>
        {/* деструкторизацией достанем тайтл и контент */}
       {faqData.map(({title, content}) => <Accordion key={title} title={title}>{content}</Accordion>)}
    </div>
    )
};

export default FAQPage;