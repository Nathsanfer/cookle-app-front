import { TouchableOpacity, View, ScrollView, Dimensions, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRef, useState, useEffect } from 'react';

// ========== CONSTANTS ==========
// Obtém a largura da tela para definir o tamanho dos slides
const { width } = Dimensions.get('window');

// ========== COMPONENT ==========
// Carrossel de imagens com navegação automática e manual
export default function CarouselComponent({slides}) {

    // ========== STATE & REFS ==========
    const scrollRef = useRef(null); // Referência para controlar o scroll
    const [currentIndex, setCurrentIndex] = useState(0); // Índice do slide atual
    const [autoplay, setAutoplay] = useState(true); // Controla reprodução automática
    const autoplayInterval = 3000; // Intervalo de 3 segundos entre slides
    
    // ========== SCROLL HANDLER ==========
    // Detecta qual slide está visível durante a rolagem manual
    const onScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    // ========== NAVIGATION ==========
    // Navega para um slide específico com animação
    const goToSlide = (index) => {
        if (scrollRef.current && index >= 0 && index < slides.length) {
            scrollRef.current.scrollTo({ x: width * index, animated: true });
            setCurrentIndex(index);
        }
    };

    // ========== AUTOPLAY ==========
    // Avança automaticamente para o próximo slide a cada 3 segundos
    // Volta ao primeiro slide quando chega no último
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

        // ========== RENDER ==========
        return (

            <View style={styles.carouselContainer}>
                {/* ScrollView horizontal com paginação */}
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
                    {/* Renderiza cada slide */}
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

                {/* Botão de navegação: Anterior */}
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

                {/* Botão de navegação: Próximo */}
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

                {/* Indicadores de posição (bolinhas) */}
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

// ========== STYLES ==========
const styles = {
    // Container principal do carrossel
    carouselContainer: {
        position: 'relative',
        marginTop: 15,
    },

    // ========== SLIDE STYLES ==========
    slide: {
        width,
        height: 250,
        overflow: 'hidden',
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },

    // ========== INDICATORS ==========
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

    // ========== NAVIGATION BUTTONS ==========
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