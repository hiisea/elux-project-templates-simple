
/*# if:react #*/
import {FC, useCallback} from 'react';
/*# else:vue #*/
import {defineComponent} from 'vue';
/*# end #*/
import {/*# =react?Dispatch,: #*/ connectStore, DocumentHead, Link} from '<%= elux %>';
import {APPState, Modules, useRouter} from '@/Global';
import {excludeDefaultParams} from '@/utils/tools';
import {defaultListSearch, ListItem, ListSearch, ListSummary} from '../../entity';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import styles from './index.module.less';

interface StoreProps {
  prefixPathname: string;
  listSearch: ListSearch;
  list/*# =pre??: #*/: ListItem[];
  listSummary/*# =pre??: #*/: ListSummary;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {prefixPathname, listSearch, list, listSummary} = appState.article!;
  /*# if:pre #*/
  return {prefixPathname, listSearch, list, listSummary};
  /*# else #*/
  return {prefixPathname, listSearch: listSearch, list: list!, listSummary: listSummary!};
  /*# end #*/
}

/*# if:react #*/
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, listSearch, list, listSummary, dispatch}) => {
  const router = useRouter();
  const onPageChange = useCallback(
    (pageCurrent: number) => {
      router.push({
        pathname: `${prefixPathname}/list`,
        searchQuery: excludeDefaultParams(defaultListSearch, {keyword: listSearch.keyword, pageCurrent}),
      }, 'page');
    },
    [router, prefixPathname, listSearch?.keyword]
  );
  const onSearch = useCallback(
    (keyword: string) => {
      router.push({pathname: `${prefixPathname}/list`, searchQuery: excludeDefaultParams(defaultListSearch, {keyword})}, 'page');
    },
    [router, prefixPathname]
  );
  const onDeleteItem = useCallback(
    (id) => {
      dispatch(Modules.article.actions.deleteItem(id));
    },
    [dispatch]
  );
  const onEditItem = useCallback(
    (id = '0') => {
      router.push({url: `${prefixPathname}/edit?id=${id}`, classname: '_dialog'}, 'window');
    },
    [router, prefixPathname]
  );

  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title="文章列表" />
      <h2>文章管理</h2>
      <SearchBar keyword={listSearch.keyword} onSubmit={onSearch} onCreate={onEditItem} />
      /*# if:pre #*/
      {list && listSummary && (
      /*# end #*/
        <>
          <table className="list">
            <colgroup>
              <col width="100px" />
              <col width="30%" />
              <col />
              <col width="150px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>文章标题</th>
                <th>摘要</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td className="item-id">{item.id}</td>
                  <td className="item-title">
                    <Link to={`${prefixPathname}/detail?id=${item.id}`} action="push" target="window">
                      {item.title}
                    </Link>
                  </td>
                  <td className="item-summary">{item.summary}</td>
                  <td className="item-action">
                    <Link to={`${prefixPathname}/detail?id=${item.id}`} action="push" target="window">
                      查看
                    </Link>
                    <Link to={`${prefixPathname}/edit?id=${item.id}&__c=_dialog`} action="push" target="window">
                      修改
                    </Link>
                    <a className="item" onClick={() => onDeleteItem(item.id)}>
                      删除
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Pagination totalPages={listSummary.totalPages} pageCurrent={listSummary.pageCurrent} onChange={onPageChange} />
          </div>
          <Link className="g-ad" to="/shop/list" action="push" target="window">
            -- 特惠商城，盛大开业 --
          </Link>
        </>
      /*# if:pre #*/
      )}
      /*# end #*/
    </div>
  );
};

export default connectStore(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleList',
  setup() {
    const router = useRouter();
    const storeProps = connectStore(mapStateToProps);
    const onPageChange = (pageCurrent: number) => {
      const {prefixPathname, listSearch} = storeProps;
      router.push(
        {
          pathname: `${prefixPathname}/list`,
          searchQuery: excludeDefaultParams(defaultListSearch, {keyword: listSearch.keyword, pageCurrent}),
        },
        'page'
      );
    };
    const onSearch = (keyword: string) => {
      router.push(
        {pathname: `${storeProps.prefixPathname}/list`, searchQuery: excludeDefaultParams(defaultListSearch, {pageCurrent: 1, keyword})},
        'page'
      );
    };
    const onDeleteItem = (id: string) => {
      storeProps.dispatch(Modules.article.actions.deleteItem(id));
    };
    const onEditItem = (id: string = '0') => {
      router.push({url: `${storeProps.prefixPathname}/edit?id=${id}`, classname: '_dialog'}, 'window');
    };

    return () => {
      const {listSearch, list, listSummary, prefixPathname} = storeProps;
      return (
      <div class={`${styles.root} g-page-content`}>
        <DocumentHead title="文章列表" />
        <h2>文章管理</h2>
        <SearchBar keyword={listSearch.keyword} onSubmit={onSearch} onCreate={onEditItem} />
        /*# if:pre #*/
        {list && listSummary && (
        /*# end #*/
          <>
            <table class="list">
              <colgroup>
                <col width="100px" />
                <col width="30%" />
                <col />
                <col width="150px" />
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>文章标题</th>
                  <th>摘要</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td class="item-id">{item.id}</td>
                    <td class="item-title">
                      <Link to={`${prefixPathname}/detail?id=${item.id}`} action="push" target="window">
                        {item.title}
                      </Link>
                    </td>
                    <td class="item-summary">{item.summary}</td>
                    <td class="item-action">
                      <Link to={`${prefixPathname}/detail?id=${item.id}`} action="push" target="window">
                        查看
                      </Link>
                      <Link to={`${prefixPathname}/edit?id=${item.id}&__c=_dialog`} action="push" target="window">
                        修改
                      </Link>
                      <a class="item" onClick={() => onDeleteItem(item.id)}>
                        删除
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <Pagination totalPages={listSummary.totalPages} pageCurrent={listSummary.pageCurrent} onChange={onPageChange} />
            </div>
            <Link class="g-ad" to="/shop/list" action="push" target="window">
              -- 特惠商城，盛大开业 --
            </Link>
          </>
        /*# if:pre #*/
        )}
        /*# end #*/
      </div>
    );
    };
  },
});

export default Component;
/*# end #*/
