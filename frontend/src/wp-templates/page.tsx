import { print } from "graphql"
import Head from "next/head";
import EntryHeader from "../components/entry-header";
import Footer from "../components/footer";
import Header from "../components/header";
import { FaustTemplate } from "@faustwp/core";
import { flatListToHierarchical } from '@faustwp/core';
import { WordPressBlocksViewer } from '@faustwp/blocks';
import blocks from '../wp-blocks';
import { gql } from "@apollo/client";

const Component: FaustTemplate<any> = (props) => {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props.data.generalSettings;
  const menuItems = props.data.primaryMenuItems.nodes;
  const { title, editorBlocks } = props.data.page;
  const blockList = flatListToHierarchical(editorBlocks, { childrenKey: 'innerBlocks' });

  return (
    <>
      <Head>
        <title>{`${title} - ${siteTitle}`}</title>
      </Head>

      <Header
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        menuItems={menuItems}
      />

      <main className="container">
        <EntryHeader title={title} />
        <WordPressBlocksViewer blocks={blockList} />
      </main>

      <Footer />
    </>
  );
};

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  };
};

Component.query = gql(`
  ${print(blocks.CoreParagraph.fragments.entry)}
  ${print(blocks.CoreColumns.fragments.entry)}
  ${print(blocks.CoreColumn.fragments.entry)}
  ${print(blocks.CoreCode.fragments.entry)}
  ${print(blocks.CoreButtons.fragments.entry)}
  ${print(blocks.CoreButton.fragments.entry)}
  ${print(blocks.CoreQuote.fragments.entry)}
  ${print(blocks.CoreImage.fragments.entry)}
  ${print(blocks.CoreSeparator.fragments.entry)}
  ${print(blocks.CoreList.fragments.entry)}
  ${print(blocks.CoreHeading.fragments.entry)}

  query GetPage($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      editorBlocks(flat: false) {
        name
        __typename
        renderedHtml
        id: clientId
        parentId: parentClientId

        ...${blocks.CoreParagraph.fragments.key}
        ...${blocks.CoreColumns.fragments.key}
        ...${blocks.CoreColumn.fragments.key}
        ...${blocks.CoreCode.fragments.key}
        ...${blocks.CoreButtons.fragments.key}
        ...${blocks.CoreButton.fragments.key}
        ...${blocks.CoreQuote.fragments.key}
        ...${blocks.CoreImage.fragments.key}
        ...${blocks.CoreSeparator.fragments.key}
        ...${blocks.CoreList.fragments.key}
        ...${blocks.CoreHeading.fragments.key}
      }
    },
    generalSettings {
      title
      description
    }
    primaryMenuItems: menuItems(where: { location: PRIMARY }) {
      nodes {
        id
        uri
        path
        label
        parentId
        cssClasses
        menu {
          node {
            name
          }
        }
      }
    }
  }
`);

export default Component;
