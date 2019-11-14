'use strict'//厳格モード
{
  const cal_btn = document.querySelectorAll('.cal_btn');//HTML(電卓のボタン)要素を取得
  let output_sub = document.getElementById('output_sub'); //計算結果を表示する場所を取得
  const output_total = document.getElementById('output_total'); //計算過程を表示する場所を取得
  let total = 0; //計算式を表す変数
  let state = 'start'; //初期の状態を定義

  //  (1)計算する前の最初の状態（start）
  //  (2)数字を入力している途中（calculation）
  //  (3)「＋ ÷ － × ＝」を押した後（calBtn）
  //  (4)「＝」計算が終わった後（finish）

  //  → 変数stateに、(1)~(4)を代入して計算状態を管理する

  let mode = 'integer_mode'; //初期値は整数入力モード
  //  変数modeに、整数入力中integer_mode、小数入力中decimal_modeを定義


  //* 1-9の数字ボタンを押した時
  const one_nine = document.querySelectorAll('.one_nine'); //HTML(1-9ボタン)要素を取得
  one_nine.forEach(index => { //forEach(処理):引数に関数オブジェクトをひとつ受け取る、戻り値はなし
    index.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
      if (state === 'start') { //最初(total)に打った数字を代入する
        total = index.dataset.indexId; //datasetプロパティでカスタムデータ属性data-index-idの値を取得
      } else if (state === 'finish') {
        reset(); //計算したらリセット処理、その後totalに打った数字を代入する
        total = index.dataset.indexId;
      } else if (state === 'calculation' || state === 'calBtn') {
        total += index.dataset.indexId; //計算途中に打った数字を追加して、totalに代入する
      }
      output_sub.textContent = total; //totalのテキスト情報を取得
      state = 'calculation' //数字を入力している状態にする
      changeOutput() //計算結果・計算過程画面の入れ替える ※定義は一番下
    }) //index(click)
  }) //forEach

  //* 0の数字ボタンを押した時
  const zero = document.getElementById('zero'); //0ボタンを取得
  zero.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
    //    - 最初 state==='start
    //    - 計算終了した後 state==='finish'
    //    - 演算記号入力直後 state==='calBtn' の時、
    //    前の文字が0の時は0が入力できないようにする。↓
    if (state === 'start' || state === 'finish' || state === 'calBtn') {
      if (output_sub.textContent.slice(-1) === '0') {  //sliceで1段前で切り出されたのは'0'
        console.log('入力エラー：前の文字はゼロです');
        return; //処理をした結果を戻り値として返す(この値を使ってさらに別の処理を続ける)
      }
    }

    if (state === 'start') { //one_nineと同様に計算したときの処理
      total = zero.dataset.indexId;
    } else {
      total += zero.dataset.indexId;
    }
    output_sub.textContent = total;
    changeOutput() //計算結果・計算過程画面の入れ替える ※定義は一番下
    //    state = 'calculation'//数字を入力している状態にする。
  }) //zero(click)

  //*「.」小数点ボタンを押した時
  const point = document.getElementById('point'); //.ボタンを取得
  point.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
    console.log(point.dataset.indexId) //.を表示
    if (mode === 'decimal_mode') {
      return; //小数点入力モードの時、もう一度小数点を押せないようにする
    }
    //*「.4」と入力したら0.4にしたいので、(1)+(2)で0.4に
    if (state === 'start' || state === 'finish') {
      total = 0; //(1)最初と計算終了直後の時、0を入力する
    } else if (state === 'calBtn') { //0.4+0.4と打つと0.4+00.4とならないようにする
      if (output_sub.textContent.slice(-1) !== '0') {
        total += 0; //(1)演算記号が入力直後なら、今までの計算結果に0を入力
      }
    }
    total += point.dataset.indexId; //(2)「.」を入力

    output_sub.textContent = total; //計算途中画面
    state = 'calculation' //数字を入力している状態にする
    mode = 'decimal_mode'; //小数入力モードに変更
    changeOutput() //計算結果・計算過程画面の入れ替える
  }) //point(click)

  //*「＋ ÷ － ×」ボタンを押した時
  const cal = document.querySelectorAll('.cal'); //演算記号を取得
  cal.forEach(index => {
    index.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
      if (state === 'start') {
        return; //.と同様に最初に演算記号は押せないように
      } else if (state === 'calculation') {
        total += index.dataset.indexId; //計算中はtotalに打った記号を追加し、totalに代入する
      } else if (state === 'finish') { //計算後は前の計算結果をtotal に代入して計算しなおす
        total = output_total.textContent;
        total += index.dataset.indexId;
        output_total.textContent = 0
      } else if (state === 'calBtn') {
        // 演算記号入力状態 state = 'calBtn'の時に、演算記号を押したら、totalの最後の一文字（演算記号）を削除して新たに押した演算記号を追加する
        //        → totalに、totalの最初から、最後から2文字目までを代入する（最後の一文字を削除する）
        total = total.slice(0, -1)
        total += index.dataset.indexId;
      }

      output_sub.textContent = total;
      state = 'calBtn' //演算記号を入力している状態する
      mode = 'integer_mode' //整数モードに戻す
      changeOutput() //計算結果・計算過程画面の入れ替える
    }) //cal(click)
  }) //forEach

  //* イコールを押した時
  const equal_btn = document.getElementById('equal_btn'); //=を取得
  equal_btn.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
    console.log(eval(total)); //totalを表示
    output_total.textContent = digitNum(eval(total)); //桁数を揃える関数10桁を表示させる関数digitNum
    state = 'finish' //計算が終わった状態にする
    mode = 'integer_mode' //整数モードに戻す
    changeOutput() //計算結果・計算過程画面の入れ替える
  }); //equal_btn(click)

  //* Cボタン（リセットボタン）を押した時
  const clear = document.getElementById('clear') // Cを取得
  clear.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
    reset();//Cボタンクリックしたらリセット
  }) //clear(click)

  //* リセットを行う関数
  function reset() {
    total = 0;
    output_sub.textContent = 0;
    output_total.textContent = 0;
    mode = 'integer_mode' //整数モードに戻す
    state = 'start';
    changeOutput() //計算結果・計算過程画面の入れ替える
  }

  //* BSボタン（バックスペース）を押した時
  const bs = document.getElementById('bs') //bsを取得
  bs.addEventListener('click', () => { //イベントの種類はclick、無名関数をアロー関数で設定
    if (state === 'finish') {
      return; //計算終了後はbsを押せないように
    }
    // 一文字目から、最後から2文字目までをtotalに代入（最後の一文字を除きtotalに代入する）
    total = output_sub.textContent.slice(0, -1);
    output_sub.textContent = total;

    let lastWord = output_sub.textContent.slice(-1)
    if (lastWord === '+' || lastWord === '-' || lastWord === '*' || lastWord === '/') {
      state = 'calBtn'//bsを押し、最後の文字が演算記号ならstateを演算記号入力中 calBtn に変更する
    } else if (lastWord === '') {
      state = 'start'; //bsを押し、文字が空ならstateを最初 start に変更する
    }
  }); //bs(click)

  //* 桁数を揃える関数10桁を表示させる関数(X)
  function digitNum(num) {
    return Math.round(num * 100000000) / 100000000;
  }

  //計算過程結果、計算結果画面の表示の切り替え
  // 「=」を押した後、計算後 state==='finish' の時だけ
  //  計算結果画面 output_totalにclass="active" を付ける、そのほかの時はその逆にする
  function changeOutput() {
    if (state === 'finish') {
      output_total.classList.add('active');
      output_sub.classList.remove('active');
    } else {
      output_sub.classList.add('active');
      output_total.classList.remove('active');
    }
  }
}
