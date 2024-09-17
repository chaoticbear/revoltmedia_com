import Head from "next/head";
import EntryHeader from "../components/entry-header";
import Footer from "../components/footer";
import Header from "../components/header";
import { GetPostQuery } from "../__generated__/graphql";
import { FaustTemplate, flatListToHierarchical } from "@faustwp/core";
import blocks from '../wp-blocks';
import { gql } from "@apollo/client";
import { print } from "graphql"
import { WordPressBlocksViewer } from "@faustwp/blocks";

const Component: FaustTemplate<GetPostQuery> = (props) => {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { post, generalSettings, primaryMenuItems } = props.data;
  const { title: siteTitle, description: siteDescription } = generalSettings;
  const { nodes: menuItems } = primaryMenuItems;
  const { title, editorBlocks, date, author } = post;
  const blockList = flatListToHierarchical(editorBlocks, { childrenKey: 'innerBlocks' });
  console.log({blockList})

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

      <main className="container is-layout-constrained is-root-container is-layout-flow wp-block-post-content-is-layout-flow wp-block-post-content">
        <EntryHeader title={title} date={date} author={author.node.name} />
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

  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      author {
        node {
          name
        }
      }
      editorBlocks(flat: true) {
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
    }
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

console.log(print(Component.query))

export default Component;
