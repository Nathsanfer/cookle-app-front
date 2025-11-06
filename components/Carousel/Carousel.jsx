import { TouchableOpacity, View, ScrollView, Dimensions, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRef, useState, useEffect } from 'react';

// Variável é usada para obter a largura da tela do dispositivo, para que possamos definir a largura dos slides do carrossel.
const { width } = Dimensions.get('window');

export default function CarouselComponent({slides}) {

    // Variável usada para rolar o carrossel.
        const scrollRef = useRef(null);
        //Variável que rastreia (o índice) qual slide está sendo exibido atualmente.
        const [currentIndex, setCurrentIndex] = useState(0);
        // Variável para controlar se o carrossel deve ser reproduzido automaticamente ou não.
        const [autoplay, setAutoplay] = useState(true);
        // Variável para o intervalo de tempo entre as transições automáticas do carrossel.
        const autoplayInterval = 3000; // 3 segundos
    
        // É uma função de callback que detecta e processa os eventos de rolagem do carrossel. Esta função é crucial para o funcionamento do carrossel, pois permite que o componente saiba qual slide está sendo exibido durante a navegação manual.
        const onScroll = (event) => {
            // Calcula qual "página" (slide) está visível na tela
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            // Atualiza o índice atual com base na rolagem
            setCurrentIndex(index);
        };
    
        // Variável que permite mudar o slide para qualquer slide específico com um comando.
        const goToSlide = (index) => {
            // 1° Recebe o índice do slide que quer mostrar; 
            // 2° Verifica se o índice é válido e se o carrossel está pronto para ser rolado;
            // 3° Calcula a posição do slide e realiza uma animação para fazer a transição do slide;
            if (scrollRef.current && index >= 0 && index < slides.length) {
                scrollRef.current.scrollTo({ x: width * index, animated: true });
                // Atualiza o índice atual para o novo índice
                setCurrentIndex(index);
            }
        };
    
        /*
        O código cria um autoplay no carrossel:
            - A cada 3 segundos, avança para o próximo slide.
            - Se estiver no último, volta pro primeiro.
            - Usa a função goToSlide para trocar o slide.
            - Reinicia o timer sempre que currentIndex ou autoplay mudar.
            - Limpa o timer quando o componente desmonta para evitar bugs.
        */
        useEffect(() => {
            let timer;
            if (autoplay) {
                timer = setInterval(() => {
                    const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
                    goToSlide(nextIndex);
                }, autoplayInterval);
            }
            return () => clearInterval(timer);
        }, [currentIndex, autoplay]);

        return (

            <View style={styles.carouselContainer}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ width: width * slides.length }}
                    decelerationRate="fast"
                    onTouchStart={() => setAutoplay(false)}
                    onMomentumScrollEnd={() => setAutoplay(true)}
                >
                    {slides.map((slide, index) => (
                        <View
                            key={index}
                            style={styles.slide}
                        >
                            <Image
                                source={slide.image}
                                style={styles.slideImage}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={[styles.navButtonOverlay, styles.navButtonLeft]}
                    disabled={currentIndex === 0}
                    onPress={() => {
                        setAutoplay(false);
                        goToSlide(currentIndex - 1);
                        setTimeout(() => {
                            setAutoplay(true);
                        }, 3000);
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#fff"} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButtonOverlay, styles.navButtonRight]}
                    disabled={currentIndex === slides.length - 1}
                    onPress={() => {
                        setAutoplay(false);
                        goToSlide(currentIndex + 1);
                        setTimeout(() => {
                            setAutoplay(true);
                        }, 3000);
                    }}
                >
                    <Ionicons name="chevron-forward" size={24} color={currentIndex === slides.length - 1 ? "#ccc" : "#fff"} />
                </TouchableOpacity>

                <View style={styles.indicatorContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentIndex === index && styles.activeIndicator,
                            ]}
                        />
                    ))}
                </View>
            </View>

        );

}

const styles = {
    carouselContainer: {
        position: 'relative',
        marginTop: 15,
    },
    slide: {
        width,
        height: 250,
        overflow: 'hidden',
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        margin: 5,
    },
    activeIndicator: {
        backgroundColor: '#A7333F',
    },
    navButtonOverlay: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 25,
        padding: 8,
        zIndex: 10,
    },
    navButtonLeft: {
        left: 10,
    },
    navButtonRight: {
        right: 10,
    }
};