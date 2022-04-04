/*# if:react #*/
import {FC, useCallback} from 'react';
/*# else:vue #*/
import {defineComponent, computed} from 'vue';
/*# end #*/
import {DocumentHead, Link, /*# =react?Dispatch, connectRedux:ComputedStore, exportView #*/} from '<%= elux %>';
import {APPState, Modules, useRouter/*# =vue?, useStore: #*/} from '@/Global';
import {excludeDefaultParams} from '@/utils/tools';
import TabBar from '@/components/TabBar';
import NavBar from '@/components/NavBar';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import {ListItem, ListSearch, ListSummary, defaultListSearch} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  listSearch/*# =pre??: #*/: ListSearch;
  list/*# =pre??: #*/: ListItem[];
  listSummary/*# =pre??: #*/: ListSummary;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {listSearch, list, listSummary} = appState.article!;
  /*# if:pre #*/
  return {listSearch, list, listSummary};
  /*# else #*/
  return {listSearch: listSearch!, list: list!, listSummary: listSummary!};
  /*# end #*/
}
/*# else:vue #*/
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const article = appState.article!;
  return {
    listSearch: () => article.listSearch/*# =post?!: #*/,
    list: () => article.list/*# =post?!: #*/,
    listSummary: () => article.listSummary/*# =post?!: #*/,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({listSearch, list, listSummary, dispatch}) => {
  const router = useRouter();
  const onPageChange = useCallback(
    (pageCurrent: number) => {
      router.push({pathname: '/article/list', searchQuery: excludeDefaultParams(defaultListSearch, {pageCurrent, keyword: listSearch?.keyword})});
    },
    [listSearch?.keyword, router]
  );
  const onSearch = useCallback(
    (keyword: string) => {
      router.push({pathname: '/article/list', searchQuery: excludeDefaultParams(defaultListSearch, {keyword})});
    },
    [router]
  );
  const onDeleteItem = useCallback(
    (id) => {
      dispatch(Modules.article.actions.deleteItem(id));
    },
    [dispatch]
  );
  const onEditItem = useCallback(
    (id = '0') => {
      router.push({url: `/article/edit/${id}`}, 'window');
    },
    [router]
  );
  return (
    <>
      <DocumentHead title="文章" />
      <NavBar title="文章列表" />
      <div className={`${styles.root} g-page-content`}>
        /*# if:pre #*/
        {listSearch && list && listSummary && (
          <>
        /*# else #*/
          /*# [[[-4 #*/
        /*# end #*/
            <SearchBar keyword={listSearch.keyword} onSubmit={onSearch} onCreate={onEditItem} />
            <div className="article-list">
              {list.map((item) => (
                <div key={item.id} className="article-item">
                  <Link className="article-title" to={`/article/detail/${item.id}`} target="window">
                    {item.title}
                  </Link>
                  <Link className="article-summary" to={`/article/detail/${item.id}`} target="window">
                    {item.summary}
                  </Link>
                  <div className="article-operation">
                    <div className="item" onClick={() => onEditItem(item.id)}>
                      修改
                    </div>
                    <div className="item" onClick={() => onDeleteItem(item.id)}>
                      删除
                    </div>
                  </div>
                </div>
              ))}
              <Pagination totalPages={listSummary.totalPages} pageCurrent={listSummary.pageCurrent} onChange={onPageChange} />
            </div>
        /*# if:pre #*/
          </>
        )}
        /*# else #*/
          /*# ]]] #*/
        /*# end #*/
      </div>
      <TabBar selected="article" />
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleList',
  setup() {
    const router = useRouter();
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const listSearch = computed(computedStore.listSearch);
    const list = computed(computedStore.list);
    const listSummary = computed(computedStore.listSummary);
    const onPageChange = (pageCurrent: number) => {
      router.push({
        pathname: '/article/list',
        searchQuery: excludeDefaultParams(defaultListSearch, {pageCurrent, keyword: listSearch.value!.keyword}),
      });
    };
    const onSearch = (keyword: string) => {
      router.push({pathname: '/article/list', searchQuery: excludeDefaultParams(defaultListSearch, {pageCurrent: 1, keyword})});
    };
    const onDeleteItem = (id: string) => {
      store.dispatch(Modules.article.actions.deleteItem(id));
    };
    const onEditItem = (id: string = '0') => {
      router.push({url: `/article/edit/${id}`}, 'window');
    };

    return () => (
      <>
        <DocumentHead title="文章" />
        <NavBar title="文章列表" />
        <div class={`${styles.root} g-page-content`}>
          /*# if:pre #*/
          {listSearch.value && list.value && listSummary.value && (
            <>
          /*# else #*/
            /*# [[[-4 #*/
          /*# end #*/
              <SearchBar keyword={listSearch.value.keyword} onSubmit={onSearch} onCreate={onEditItem} />
              <div class="article-list">
                {list.value.map((item) => (
                  <div key={item.id} class="article-item">
                    <Link class="article-title" to={`/article/detail/${item.id}`} target="window">
                      {item.title}
                    </Link>
                    <Link class="article-summary" to={`/article/detail/${item.id}`} target="window">
                      {item.summary}
                    </Link>
                    <div class="article-operation">
                      <div class="item" onClick={() => onEditItem(item.id)}>
                        修改
                      </div>
                      <div class="item" onClick={() => onDeleteItem(item.id)}>
                        删除
                      </div>
                    </div>
                  </div>
                ))}
                <Pagination totalPages={listSummary.value.totalPages} pageCurrent={listSummary.value.pageCurrent} onChange={onPageChange} />
              </div>
          /*# if:pre #*/
            </>
          )}
          /*# else #*/
            /*# ]]] #*/
          /*# end #*/
        </div>
        <TabBar selected="article" />
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
